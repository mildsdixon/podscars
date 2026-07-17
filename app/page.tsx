import Link from "next/link"
import { ArrowRight, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdvertisingCarousel } from "@/components/podscars/advertising-carousel"
import { getAdSpots } from "@/lib/podscars-ads"
import { getAdminSettings } from "@/lib/podscars-admin"
import { getPodscarsContent } from "@/lib/podscars-content"
import { campaignTimeline } from "@/lib/podscars-data"
import { getPodscarsLiveData, type PodscarsLiveData } from "@/lib/podscars-live"
import { isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [{ categories }, adSpots, settings] = await Promise.all([getPodscarsContent(), getAdSpots(), getAdminSettings()])
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
  ]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#f8fafc_100%)]">
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
          <div>
            <Badge className="mb-5 bg-slate-950 text-white hover:bg-slate-900">
              Podscars Awards Platform
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

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <p className="text-3xl font-semibold text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {isSupabaseConfigured()
                ? `${typeCount} content types and live submissions are active.`
                : "Connect the live data settings to turn the site fully live."}
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

      <AdvertisingCarousel spots={adSpots} />

      <section className="border-y border-slate-200 bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">{settings.homepageFlowEyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl">{settings.homepageFlowTitle}</h2>
            <p className="mt-4 max-w-xl text-slate-300">{settings.homepageFlowSummary}</p>
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
    </div>
  )
}
