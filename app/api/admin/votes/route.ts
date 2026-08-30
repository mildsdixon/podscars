import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/podscars-admin"
import { getPodscarsLiveData } from "@/lib/podscars-live"
import { isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Live votes are not configured." }, { status: 503 })
  }

  const liveData = await getPodscarsLiveData()

  return NextResponse.json({
    votes: liveData.votes,
    stats: liveData.stats,
    leaderboard: liveData.leaderboard,
    source: liveData.source,
  })
}
