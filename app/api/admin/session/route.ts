import { NextResponse } from "next/server"
import { z } from "zod"
import { clearAdminSession, createAdminSession, isAdminConfigured, isAdminAuthenticated } from "@/lib/podscars-admin"
import { isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const sessionSchema = z.object({
  password: z.string().min(1),
})

export async function GET() {
  return NextResponse.json({
    authenticated: await isAdminAuthenticated(),
    configured: isAdminConfigured(),
    mode: isSupabaseConfigured() ? "supabase" : "password",
  })
}

export async function POST(request: Request) {
  if (isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Use the Supabase sign-in flow at /login for admin access." },
      { status: 405 },
    )
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Set PODSCARS_ADMIN_PASSWORD before using the admin area." },
      { status: 503 },
    )
  }

  const payload = await request.json().catch(() => null)
  const parsed = sessionSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your admin password." }, { status: 400 })
  }

  if (parsed.data.password !== process.env.PODSCARS_ADMIN_PASSWORD) {
    return NextResponse.json({ error: "That password was not recognized." }, { status: 401 })
  }

  await createAdminSession()

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  if (isSupabaseConfigured()) {
    return NextResponse.json({ error: "Use Supabase sign out from the app UI." }, { status: 405 })
  }

  await clearAdminSession()
  return NextResponse.json({ success: true })
}
