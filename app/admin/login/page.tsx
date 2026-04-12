import Link from "next/link"
import { redirect } from "next/navigation"
import { LockKeyhole, ShieldCheck } from "lucide-react"
import { AdminLogin } from "@/components/podscars/admin-login"
import { Badge } from "@/components/ui/badge"
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/podscars-admin"
import { getPodscarsAuthContext } from "@/lib/podscars-auth"
import { isSupabaseConfigured } from "@/lib/supabase"

export default async function AdminLoginPage() {
  if (isSupabaseConfigured()) {
    const auth = await getPodscarsAuthContext()

    if (auth.user && auth.profile?.is_admin) {
      redirect("/admin")
    }

    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#f8fafc_100%)]">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
            <Badge className="bg-slate-950 text-white hover:bg-slate-900">Admin login</Badge>
            <h1 className="mt-4 font-serif text-5xl text-slate-950 md:text-6xl">Admin access uses your account.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Sign in with your Podscars user account, then users marked with <code>is_admin = true</code> can open the dashboard.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <LockKeyhole className="h-8 w-8 text-slate-950" />
              <p className="mt-4 text-xl font-semibold text-slate-950">Shared account login</p>
              <p className="mt-2 text-slate-600">Regular sign-in creates the session, and admin access is granted by role.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <ShieldCheck className="h-8 w-8 text-slate-950" />
              <p className="mt-4 text-xl font-semibold text-slate-950">Admin role required</p>
              <p className="mt-2 text-slate-600">If your account is not flagged as admin yet, you can sign in but you still will not reach the control room.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <p className="text-xl font-semibold text-slate-950">Continue to admin sign-in</p>
            <p className="mt-3 max-w-2xl text-slate-600">
              Use the main account login flow and we&apos;ll send you straight into the admin dashboard when your account is approved.
            </p>
            <Link
              href="/login?next=/admin"
              className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open admin sign-in
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const configured = isAdminConfigured()
  const authenticated = await isAdminAuthenticated()

  if (authenticated) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <Badge className="bg-slate-950 text-white hover:bg-slate-900">Admin login</Badge>
          <h1 className="mt-4 font-serif text-5xl text-slate-950 md:text-6xl">Run Podscars from one place.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Sign in to manage submissions and switch nominations or voting on and off.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <LockKeyhole className="h-8 w-8 text-slate-950" />
            <p className="mt-4 text-xl font-semibold text-slate-950">Protected admin access</p>
            <p className="mt-2 text-slate-600">Only the configured admin password can open this dashboard.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <ShieldCheck className="h-8 w-8 text-slate-950" />
            <p className="mt-4 text-xl font-semibold text-slate-950">Live controls</p>
            <p className="mt-2 text-slate-600">Close forms instantly and update nomination review status without code edits.</p>
          </div>
        </div>

        <AdminLogin configured={configured} />
      </section>
    </div>
  )
}
