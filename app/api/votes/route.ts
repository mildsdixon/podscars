import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSettings } from "@/lib/podscars-admin"
import { getPodscarsLiveData } from "@/lib/podscars-live"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const voteSchema = z.object({
  categoryId: z.string().min(1),
  categoryTitle: z.string().min(1),
  nomineeName: z.string().min(1),
})

const ballotSchema = z.object({
  voterName: z.string().min(1),
  voterEmail: z.string().email(),
  votes: z.array(voteSchema).min(1),
})

export async function POST(request: Request) {
  const settings = await getAdminSettings()

  if (!settings.votingOpen) {
    return NextResponse.json({ error: settings.votingMessage }, { status: 403 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 })
  }

  const payload = await request.json().catch(() => null)
  const parsed = ballotSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the ballot and include your email." }, { status: 400 })
  }

  try {
    const authClient = await createSupabaseServerClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()
    const normalizedEmail = user?.email?.toLowerCase() || parsed.data.voterEmail.toLowerCase()
    const supabase = getSupabaseAdminClient()
    const payload = parsed.data.votes.map((vote) => ({
      category_id: vote.categoryId,
      category_title: vote.categoryTitle,
      nominee_name: vote.nomineeName,
      voter_name: parsed.data.voterName,
      voter_email: normalizedEmail,
      user_id: user?.id ?? null,
      submitted_at: new Date().toISOString(),
    }))

    const { error } = await supabase.from("votes").upsert(payload, {
      onConflict: "category_id,voter_email",
    })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Your Podscars ballot has been saved.",
    })
  } catch (error) {
    console.error("Failed to save Podscars ballot.", error)

    return NextResponse.json({ error: "We could not save your vote right now. Please try again." }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 })
    }

    const liveData = await getPodscarsLiveData()

    return NextResponse.json({
      votes: liveData.votes,
      stats: {
        total: liveData.stats.votes,
        uniqueVoters: liveData.stats.uniqueVoters,
        categoriesWithVotes: liveData.stats.categoriesWithVotes,
      },
      leaderboard: liveData.leaderboard,
      source: liveData.source,
    })
  } catch (error) {
    console.error("Failed to load votes.", error)

    return NextResponse.json({ error: "We could not load votes right now." }, { status: 500 })
  }
}
