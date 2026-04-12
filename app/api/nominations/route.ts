import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSettings } from "@/lib/podscars-admin"
import { getPodscarsLiveData } from "@/lib/podscars-live"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const nominationSchema = z.object({
  categoryId: z.string().min(1),
  categoryTitle: z.string().min(1),
  nomineeName: z.string().min(1),
  projectTitle: z.string().min(1),
  link: z.string().url().optional().or(z.literal("")),
  reason: z.string().min(10),
  submittedBy: z.string().min(1),
  submitterEmail: z.string().email(),
})

export async function POST(request: Request) {
  const settings = await getAdminSettings()

  if (!settings.nominationsOpen) {
    return NextResponse.json({ error: settings.nominationsMessage }, { status: 403 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = nominationSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill out all required nomination fields." }, { status: 400 })
  }

  try {
    const authClient = await createSupabaseServerClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    const supabase = getSupabaseAdminClient()
    const { data: record, error } = await supabase
      .from("nominations")
      .insert({
        category_id: parsed.data.categoryId,
        category_title: parsed.data.categoryTitle,
        nominee_name: parsed.data.nomineeName,
        project_title: parsed.data.projectTitle,
        reference_link: parsed.data.link || null,
        reason: parsed.data.reason,
        submitted_by: parsed.data.submittedBy,
        submitter_email: user?.email?.toLowerCase() || parsed.data.submitterEmail.toLowerCase(),
        user_id: user?.id ?? null,
        status: "New",
      })
      .select("id")
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      recordId: record.id,
      message: "Nomination submitted successfully.",
    })
  } catch (error) {
    console.error("Failed to create nomination record.", error)

    return NextResponse.json(
      { error: "We could not save that nomination right now. Please try again." },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 })
    }

    const liveData = await getPodscarsLiveData()

    return NextResponse.json({
      nominations: liveData.nominations,
      stats: {
        total: liveData.stats.nominations,
      },
      source: liveData.source,
    })
  } catch (error) {
    console.error("Failed to load nominations.", error)

    return NextResponse.json({ error: "We could not load nominations right now." }, { status: 500 })
  }
}
