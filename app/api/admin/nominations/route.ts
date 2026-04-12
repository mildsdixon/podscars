import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/podscars-admin"
import { getPodscarsLiveData } from "@/lib/podscars-live"
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const nominationUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.string().min(1),
})

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  }

  const liveData = await getPodscarsLiveData()

  return NextResponse.json({
    nominations: liveData.nominations,
    source: liveData.source,
  })
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = nominationUpdateSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a nomination id and status." }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  }

  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("nominations")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Nomination not found." }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
