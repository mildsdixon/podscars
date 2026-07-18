import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isAdminAuthenticated } from "@/lib/podscars-admin"
import { getPodscarsAuthContext } from "@/lib/podscars-auth"
import { getPodscarsContent } from "@/lib/podscars-content"
import { getPodscarsLiveData, type PodscarsLiveData } from "@/lib/podscars-live"
import { campaignTimeline, organizerChecklist } from "@/lib/podscars-data"
import { isSupabaseConfigured } from "@/lib/supabase"

function formatTimestamp(value: string | null) {
  if (!value) {
    return "No timestamp"
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export default async function PlanningPage() {
  if (isSupabaseConfigured()) {
    const auth = await getPodscarsAuthContext()

    if (!auth.user) {
      redirect("/admin/login")
    }

    if (!auth.profile?.is_admin) {
      redirect("/admin")
    }
  } else {
    const authenticated = await isAdminAuthenticated()

    if (!authenticated) {
      redirect("/admin/login")
    }
  }

  const { categories, source } = await getPodscarsContent()
  const liveData: PodscarsLiveData = isSupabaseConfigured()
    ? await getPodscarsLiveData()
    : {
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
  const recentVotes = liveData.votes.slice(0, 6)
  const topNominees = liveData.leaderboard.slice(0, 6)

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <Badge className="bg-slate-950 text-white hover:bg-slate-900">Organizer Blueprint</Badge>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl text-slate-950 md:text-6xl">
            Live awards dashboard.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Track nominations, voting activity, and category setup from the current database state.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Live totals</CardTitle>
            <CardDescription>
              {isSupabaseConfigured() ? "Directly from live submissions." : "Waiting for live data configuration."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Nominations</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{liveData.stats.nominations}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Votes</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{liveData.stats.votes}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Unique voters</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{liveData.stats.uniqueVoters}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Categories with votes</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{liveData.stats.categoriesWithVotes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Launch sequence</CardTitle>
            <CardDescription>From launch to winners.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaignTimeline.map((item) => (
              <div key={item.phase} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-slate-950">{item.phase}</p>
                  <Badge variant="secondary">{item.window}</Badge>
                </div>
                <p className="mt-2 text-slate-600">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Operating rules</CardTitle>
            <CardDescription>Keep it fair.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {organizerChecklist.map((item) => (
              <div key={item} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Vote leaderboard</CardTitle>
            <CardDescription>Top vote-getters across all current categories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!topNominees.length ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-slate-600">
                Votes will appear here after the first ballot is submitted.
              </div>
            ) : null}
            {topNominees.map((entry) => (
              <div key={`${entry.categoryId}-${entry.nomineeName}`} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{entry.nomineeName}</p>
                    <p className="mt-1 text-sm text-slate-500">{entry.categoryTitle}</p>
                  </div>
                  <Badge variant="secondary">{entry.votes} votes</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Recent ballots</CardTitle>
            <CardDescription>Latest saved votes from the public ballot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!recentVotes.length ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-slate-600">
                Saved ballots will appear here once voting starts.
              </div>
            ) : null}
            {recentVotes.map((vote) => (
              <div key={vote.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-slate-950">{vote.nomineeName}</p>
                <p className="mt-1 text-sm text-slate-500">{vote.categoryTitle}</p>
                <p className="mt-3 text-sm text-slate-600">
                  {vote.voterName} voted on {formatTimestamp(vote.submittedAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-3xl">Category bank</CardTitle>
            <CardDescription>
              {categories.length} categories from {source === "supabase" ? "live content" : "fallback content"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-lg font-semibold text-slate-950">{category.title}</p>
                <p className="mt-2 text-sm text-slate-500">{category.nominationPrompt}</p>
                <p className="mt-3 text-slate-600">{category.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
