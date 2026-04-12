import "server-only"

import type { PodscarsCategory, PodscarsFinalistGroup } from "@/lib/podscars-data"
import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  type SupabaseCategoryRow,
  type SupabaseFinalistRow,
  type SupabaseNominationRow,
  type SupabaseVoteRow,
} from "@/lib/supabase"

export type LiveNomination = {
  id: string
  categoryId: string
  categoryTitle: string
  nomineeName: string
  projectTitle: string
  submittedBy: string
  status: string
  submittedAt: string | null
}

export type LiveVote = {
  id: string
  categoryId: string
  categoryTitle: string
  nomineeName: string
  voterName: string
  voterEmail: string
  submittedAt: string | null
}

export type VoteLeaderboardEntry = {
  categoryId: string
  categoryTitle: string
  nomineeName: string
  votes: number
}

export type PodscarsLiveData = {
  source: "supabase"
  nominations: LiveNomination[]
  votes: LiveVote[]
  stats: {
    nominations: number
    votes: number
    uniqueVoters: number
    categoriesWithVotes: number
  }
  leaderboard: VoteLeaderboardEntry[]
}

function assertSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.")
  }
}

function sortBySubmittedAt<T extends { submittedAt: string | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0
    const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0

    return rightTime - leftTime
  })
}

function buildLeaderboard(votes: LiveVote[]) {
  const grouped = new Map<string, VoteLeaderboardEntry>()

  votes.forEach((vote) => {
    const key = `${vote.categoryId}::${vote.nomineeName}`
    const existing = grouped.get(key)

    if (existing) {
      existing.votes += 1
      return
    }

    grouped.set(key, {
      categoryId: vote.categoryId,
      categoryTitle: vote.categoryTitle,
      nomineeName: vote.nomineeName,
      votes: 1,
    })
  })

  return Array.from(grouped.values()).sort((left, right) => {
    if (right.votes !== left.votes) {
      return right.votes - left.votes
    }

    return left.categoryTitle.localeCompare(right.categoryTitle)
  })
}

export function mapSupabaseCategories(rows: SupabaseCategoryRow[]): PodscarsCategory[] {
  return rows
    .filter((row) => row.active !== false)
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
    .map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      description: row.description || "",
      nominationPrompt: row.nomination_prompt || "",
    }))
}

export function mapSupabaseFinalists(rows: SupabaseFinalistRow[], categories: PodscarsCategory[]): PodscarsFinalistGroup[] {
  const categoryIds = new Set(categories.map((category) => category.id))
  const grouped = new Map<string, { name: string; subtitle: string }[]>()

  rows
    .filter((row) => row.active !== false && categoryIds.has(row.category_id))
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
    .forEach((row) => {
      const nominees = grouped.get(row.category_id) || []
      nominees.push({
        name: row.name,
        subtitle: row.subtitle || "",
      })
      grouped.set(row.category_id, nominees)
    })

  return Array.from(grouped.entries()).map(([categoryId, nominees]) => ({
    categoryId,
    nominees,
  }))
}

function mapSupabaseNominations(rows: SupabaseNominationRow[]): LiveNomination[] {
  return sortBySubmittedAt(
    rows.map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      categoryTitle: row.category_title,
      nomineeName: row.nominee_name,
      projectTitle: row.project_title,
      submittedBy: row.submitted_by,
      status: row.status,
      submittedAt: row.submitted_at,
    })),
  )
}

function mapSupabaseVotes(rows: SupabaseVoteRow[]): LiveVote[] {
  return sortBySubmittedAt(
    rows.map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      categoryTitle: row.category_title,
      nomineeName: row.nominee_name,
      voterName: row.voter_name,
      voterEmail: row.voter_email,
      submittedAt: row.submitted_at,
    })),
  )
}

export async function getPodscarsLiveData(): Promise<PodscarsLiveData> {
  assertSupabaseConfigured()

  try {
    const supabase = getSupabaseAdminClient()
    const [{ data: nominationsData, error: nominationsError }, { data: votesData, error: votesError }] = await Promise.all([
      supabase.from("nominations").select("*").order("submitted_at", { ascending: false }),
      supabase.from("votes").select("*").order("submitted_at", { ascending: false }),
    ])

    if (nominationsError) {
      throw nominationsError
    }

    if (votesError) {
      throw votesError
    }

    const nominations = mapSupabaseNominations((nominationsData || []) as SupabaseNominationRow[])
    const votes = mapSupabaseVotes((votesData || []) as SupabaseVoteRow[])

    return {
      source: "supabase",
      nominations,
      votes,
      stats: {
        nominations: nominations.length,
        votes: votes.length,
        uniqueVoters: new Set(votes.map((vote) => vote.voterEmail.toLowerCase())).size,
        categoriesWithVotes: new Set(votes.map((vote) => vote.categoryId)).size,
      },
      leaderboard: buildLeaderboard(votes),
    }
  } catch (error) {
    console.error("Falling back to empty live data because Supabase queries failed.", error)

    return {
      source: "supabase",
      nominations: [],
      votes: [],
      stats: {
        nominations: 0,
        votes: 0,
        uniqueVoters: 0,
        categoriesWithVotes: 0,
      },
      leaderboard: [],
    }
  }
}
