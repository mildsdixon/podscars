import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/podscars/admin-dashboard"
import { SignOutButton } from "@/components/podscars/sign-out-button"
import { Badge } from "@/components/ui/badge"
import { getAdminSettings, isAdminAuthenticated } from "@/lib/podscars-admin"
import { getPodscarsAuthContext } from "@/lib/podscars-auth"
import { getPodscarsLiveData, type PodscarsLiveData } from "@/lib/podscars-live"
import { isSupabaseConfigured } from "@/lib/supabase"

export default async function AdminPage() {
  if (isSupabaseConfigured()) {
    const auth = await getPodscarsAuthContext()

    if (!auth.user) {
      redirect("/admin/login")
    }

    if (!auth.profile?.is_admin) {
      return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#f8fafc_100%)]">
          <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
            <Badge className="bg-slate-950 text-white hover:bg-slate-900">Admin backend</Badge>
            <h1 className="mt-4 font-serif text-5xl text-slate-950 md:text-6xl">You're signed in, but not approved for admin.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Mark this user as an admin in the Supabase `profiles` table by setting `is_admin` to `true`, then refresh.
            </p>
            <div className="mt-8">
              <SignOutButton next="/" />
            </div>
          </section>
        </div>
      )
    }

    const [settings, liveData] = await Promise.all([getAdminSettings(), getPodscarsLiveData()])

    return (
      <div className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <Badge className="bg-slate-950 text-white hover:bg-slate-900">Admin backend</Badge>
            <h1 className="mt-4 font-serif text-5xl text-slate-950 md:text-6xl">Podscars control room.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Manage public access, moderate nominations, and keep an eye on real submission totals.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <AdminDashboard
            initialSettings={settings}
            nominations={liveData.nominations}
            stats={liveData.stats}
            source={liveData.source}
            authMode="supabase"
          />
        </section>
      </div>
    )
  }

  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    redirect("/admin/login")
  }

  const [settings, liveData] = await Promise.all([
    getAdminSettings(),
    isSupabaseConfigured()
      ? getPodscarsLiveData()
      : Promise.resolve<PodscarsLiveData>({
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
        }),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <Badge className="bg-slate-950 text-white hover:bg-slate-900">Admin backend</Badge>
          <h1 className="mt-4 font-serif text-5xl text-slate-950 md:text-6xl">Podscars control room.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Manage public access, moderate nominations, and keep an eye on real submission totals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <AdminDashboard
          initialSettings={settings}
          nominations={liveData.nominations}
          stats={liveData.stats}
          source={liveData.source}
          authMode="password"
        />
      </section>
    </div>
  )
}
