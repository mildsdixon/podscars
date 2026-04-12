import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSettings, requireAdmin, updateAdminSettings } from "@/lib/podscars-admin"

export const dynamic = "force-dynamic"

const settingsSchema = z.object({
  nominationsOpen: z.boolean(),
  votingOpen: z.boolean(),
  nominationsMessage: z.string().min(1),
  votingMessage: z.string().min(1),
})

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  return NextResponse.json({ settings: await getAdminSettings() })
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = settingsSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Provide valid admin settings." }, { status: 400 })
  }

  const settings = await updateAdminSettings(parsed.data)

  return NextResponse.json({ success: true, settings })
}
