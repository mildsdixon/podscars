import Link from "next/link"
import { ArrowRight, Check, Crown, Database, Film, Mic2, Trophy, Vote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPodscarsContent } from "@/lib/podscars-content"
import { campaignTimeline, categoryTypeLabels, organizerChecklist } from "@/lib/podscars-data"
import { getPodscarsLiveData, type PodscarsLiveData } from "@/lib/podscars-live"
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

export default async function HomePage() {
  const { categories, finalists, source } = await getPodscarsContent()
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
  const typeCount = new Set(categories.map((category) => category.type)).size
  const stats = [
    { value: String(categories.length), label: "Categories" },
    { value: String(liveData.stats.nominations), label: "Nominations" },
    { value: String(liveData.stats.uniqueVoters), label: "Voters" },
    { value: "Supabase", label: "Source" },
  ]
  const recentNominations = liveData.nominations.slice(0, 3)

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#f8fafc_100%)]">
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
          <div>
            <Badge className="mb-5 bg-slate-950 text-white hover:bg-slate-900">
              {source === "supabase" ? "Podscars + Supabase Live Content" : "Podscars Awards Platform"}
            </Badge>
            <h1 className="max-w-3xl font-serif text-5xl leading-tight text-slate-950 md:text-7xl">
              Podscars for nominations, voting, and winners.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              A live awards site with editable categories, fan voting, and persisted submissions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/nominate">
                <Button size="lg" className="w-full bg-[hsl(355,78%,54%)] px-7 text-white hover:bg-[hsl(355,78%,48%)] sm:w-auto">
                  Start nominations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/vote">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-slate-300 bg-white/80 px-7 text-slate-950 hover:bg-slate-100 sm:w-auto"
                >
                  Open the ballot
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <p className="text-3xl font-semibold text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {isSupabaseConfigured()
                ? `${typeCount} content types and live database-backed submissions are active.`
                : "Add Supabase credentials and run the schema to turn the site fully live."}
            </p>
          </div>

          <Card className="overflow-hidden border-slate-950 bg-slate-950 text-white shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
            <CardHeader className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.28),transparent_45%)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Trophy className="h-7 w-7 text-amber-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl">How it works</CardTitle>
                  <CardDescription className="text-slate-300">Simple and fast to launch.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">1. Nominations</p>
                <p className="mt-1 text-sm text-slate-300">Fans submit picks straight into the database.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">2. Finalists</p>
                <p className="mt-1 text-sm text-slate-300">You review and shortlist from live records.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">3. Voting</p>
                <p className="mt-1 text-sm text-slate-300">Fans cast one vote per category.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(244,63,94,0.25),rgba(245,158,11,0.2))] p-4">
                <p className="font-semibold text-white">4. Winners</p>
                <p className="mt-1 text-sm text-slate-100">Leaderboard-ready results update from stored ballots.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">Live Database</p>
            <h2 className="mt-2 font-serif text-4xl text-slate-950">Submission activity</h2>
          </div>
          <Link href="/planning" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
            Open live dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[30px] border-slate-200 bg-white">
            <CardHeader>
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950">
                <Database className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl text-slate-950">Current totals</CardTitle>
              <CardDescription className="text-base">
                Real counts from the live nominations and votes tables.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Nominations received</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{liveData.stats.nominations}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Votes stored</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{liveData.stats.votes}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Unique voters</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{liveData.stats.uniqueVoters}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Categories with votes</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{liveData.stats.categoriesWithVotes}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-3xl text-slate-950">Recent nominations</CardTitle>
              <CardDescription className="text-base">
                Fresh submissions coming in through the live form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!recentNominations.length ? (
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-950">No live submissions yet</p>
                  <p className="mt-2 text-slate-600">
                    {isSupabaseConfigured()
                      ? "Once fans start nominating, entries will appear here automatically."
                      : "Once Supabase is connected, entries will appear here automatically."}
                  </p>
                </div>
              ) : null}
              {recentNominations.map((nomination) => (
                <div key={nomination.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{nomination.nomineeName}</p>
                      <p className="mt-1 text-sm text-slate-500">{nomination.categoryTitle}</p>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {nomination.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Submitted by {nomination.submittedBy} on {formatTimestamp(nomination.submittedAt)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">Award Categories</p>
            <h2 className="mt-2 font-serif text-4xl text-slate-950">Categories</h2>
          </div>
          <Link href="/planning" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
            See the organizer plan
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.type === "person" ? Mic2 : category.type === "podcast" ? Crown : Film

            return (
              <Card key={category.id} className="h-full rounded-[28px] border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl text-slate-950">{category.title}</CardTitle>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                      {categoryTypeLabels[category.type]}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{category.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">How It Works</p>
            <h2 className="mt-3 font-serif text-4xl">Simple flow</h2>
            <p className="mt-4 max-w-xl text-slate-300">Nominate, shortlist, vote, announce.</p>
          </div>

          <div className="grid gap-4">
            {campaignTimeline.map((item) => (
              <div key={item.phase} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xl font-semibold">{item.phase}</p>
                  <Badge className="bg-white/10 text-white hover:bg-white/10">{item.window}</Badge>
                </div>
                <p className="mt-2 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-[30px] border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl text-slate-950">Checklist</CardTitle>
            <CardDescription className="text-base">Keep it simple and fair.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {organizerChecklist.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-700">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[30px] border-0 bg-[linear-gradient(135deg,#be123c,#0f172a)] text-white">
          <CardHeader>
            <CardTitle className="text-3xl">Ballot preview</CardTitle>
            <CardDescription className="text-rose-100">A sample of the voting layout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!finalists.length ? (
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-lg font-semibold">No finalists published yet</p>
                <p className="mt-2 text-rose-100">Add finalists in Supabase to show them here.</p>
              </div>
            ) : null}
            {finalists.map((group) => {
              const category = categories.find((item) => item.id === group.categoryId)

              return (
                <div key={group.categoryId} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-lg font-semibold">{category?.title}</p>
                  <div className="mt-3 space-y-2">
                    {group.nominees.map((nominee) => (
                      <div key={nominee.name} className="flex items-center justify-between gap-4 rounded-xl bg-black/10 px-4 py-3">
                        <div>
                          <p className="font-medium">{nominee.name}</p>
                          <p className="text-sm text-rose-100">{nominee.subtitle}</p>
                        </div>
                        <Vote className="h-4 w-4 text-amber-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
