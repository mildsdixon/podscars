import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSettings } from "@/lib/podscars-admin"
import { getPodscarsLiveData } from "@/lib/podscars-live"
import {
  NOMINATIONS_CLOSED_MESSAGE,
  NOMINATIONS_START_MESSAGE,
  nominationsHaveClosed,
  nominationsHaveStarted,
} from "@/lib/podscars-nominations"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const nominationSchema = z.object({
  categoryId: z.string().min(1),
  categoryTitle: z.string().min(1),
  nomineeName: z.string().min(1),
  projectTitle: z.string().min(1),
  link: z.string().url().optional().or(z.literal("")),
  reason: z.string().optional().or(z.literal("")),
  submittedBy: z.string().min(1),
  submitterEmail: z.string().email(),
})

export async function POST(request: Request) {
  const settings = await getAdminSettings()

  if (!settings.nominationsOpen) {
    return NextResponse.json({ error: settings.nominationsMessage }, { status: 403 })
  }

  if (!nominationsHaveStarted()) {
    return NextResponse.json({ error: NOMINATIONS_START_MESSAGE }, { status: 403 })
  }

  if (nominationsHaveClosed()) {
    return NextResponse.json({ error: NOMINATIONS_CLOSED_MESSAGE }, { status: 403 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Live nominations are not configured yet." }, { status: 503 })
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
    const normalizedEmail = user?.email?.toLowerCase() || parsed.data.submitterEmail.toLowerCase()

    const { data: existingNominations, error: existingError } = await supabase
      .from("nominations")
      .select("id, category_title")
      .eq("category_id", parsed.data.categoryId)
      .ilike("submitter_email", normalizedEmail)
      .limit(1)

    if (existingError) {
      throw existingError
    }

    const existingNomination = existingNominations?.[0]

    if (existingNomination) {
      return NextResponse.json(
        {
          error: `This email has already submitted a nomination for ${existingNomination.category_title || parsed.data.categoryTitle}. Only one nomination per email is allowed in each category.`,
        },
        { status: 409 },
      )
    }

    const { data: record, error } = await supabase
      .from("nominations")
      .insert({
        category_id: parsed.data.categoryId,
        category_title: parsed.data.categoryTitle,
        nominee_name: parsed.data.nomineeName,
        project_title: parsed.data.projectTitle,
        reference_link: parsed.data.link || null,
        reason: parsed.data.reason || "",
        submitted_by: parsed.data.submittedBy,
        submitter_email: normalizedEmail,
        user_id: user?.id ?? null,
        status: "New",
      })
      .select("id")
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: `This email has already submitted a nomination for ${parsed.data.categoryTitle}. Only one nomination per email is allowed in each category.`,
          },
          { status: 409 },
        )
      }

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
      return NextResponse.json({ error: "Live nominations are not configured yet." }, { status: 503 })
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
