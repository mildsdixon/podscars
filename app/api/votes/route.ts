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
  awardYear: z.number().int().min(2000).max(2100).optional(),
  duplicateAction: z.enum(["keep", "overwrite"]).optional(),
})

function getCurrentAwardYear() {
  return new Date().getFullYear()
}

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
    const awardYear = parsed.data.awardYear ?? getCurrentAwardYear()
    const supabase = getSupabaseAdminClient()
    const categoryIds = parsed.data.votes.map((vote) => vote.categoryId)
    const { data: existingVotes, error: existingError } = await supabase
      .from("votes")
      .select("category_id, category_title, nominee_name, award_year")
      .eq("voter_email", normalizedEmail)
      .eq("award_year", awardYear)
      .in("category_id", categoryIds)

    if (existingError) {
      throw existingError
    }

    const existingByCategory = new Map((existingVotes || []).map((vote) => [vote.category_id, vote]))
    const duplicateVotes = parsed.data.votes
      .map((vote) => {
        const existing = existingByCategory.get(vote.categoryId)

        if (!existing) {
          return null
        }

        return {
          categoryId: vote.categoryId,
          categoryTitle: existing.category_title || vote.categoryTitle,
          existingNomineeName: existing.nominee_name,
          newNomineeName: vote.nomineeName,
          awardYear,
        }
      })
      .filter((vote): vote is NonNullable<typeof vote> => Boolean(vote))

    if (duplicateVotes.length && !parsed.data.duplicateAction) {
      return NextResponse.json(
        {
          error: "You already voted in one or more of these categories. Choose whether to keep or overwrite your existing selection.",
          duplicateVotes,
        },
        { status: 409 },
      )
    }

    const votesToSave = parsed.data.votes
      .filter((vote) => parsed.data.duplicateAction !== "keep" || !existingByCategory.has(vote.categoryId))
      .map((vote) => ({
        category_id: vote.categoryId,
        category_title: vote.categoryTitle,
        nominee_name: vote.nomineeName,
        voter_name: parsed.data.voterName,
        voter_email: normalizedEmail,
        award_year: awardYear,
        user_id: user?.id ?? null,
        submitted_at: new Date().toISOString(),
      }))

    if (votesToSave.length) {
      const write =
        parsed.data.duplicateAction === "overwrite"
          ? supabase.from("votes").upsert(votesToSave, { onConflict: "category_id,voter_email,award_year" })
          : supabase.from("votes").insert(votesToSave)
      const { error } = await write

      if (error) {
        throw error
      }
    }

    return NextResponse.json({
      success: true,
      skippedDuplicates: parsed.data.duplicateAction === "keep" ? duplicateVotes.length : 0,
      message:
        parsed.data.duplicateAction === "keep"
          ? "Your existing category votes were kept. Any new category votes have been saved."
          : parsed.data.duplicateAction === "overwrite"
            ? "Your existing category votes were overwritten with your new selections."
          : "Your Podscars ballot has been saved.",
    })
  } catch (error) {
    console.error("Failed to save Podscars ballot.", error)

    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return NextResponse.json(
        { error: "You already voted in one or more of these categories. Please submit again and choose whether to keep or overwrite your selection." },
        { status: 409 },
      )
    }

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
