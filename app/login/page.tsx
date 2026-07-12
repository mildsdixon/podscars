import { redirect } from "next/navigation"
import { AuthForm } from "@/components/podscars/auth-form"
import { Badge } from "@/components/ui/badge"
import { getPodscarsAuthContext } from "@/lib/podscars-auth"
import { isSupabaseConfigured } from "@/lib/supabase"

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const next = params.next?.startsWith("/") ? params.next : "/admin"

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#f8fafc_100%)]">
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <Badge className="bg-slate-950 text-white hover:bg-slate-900">Account setup required</Badge>
          <h1 className="mt-4 font-serif text-5xl text-slate-950 md:text-6xl">Connect account access to unlock sign-in.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            This app needs live account settings for user accounts, authentication, and admin access.
          </p>
        </section>
      </div>
    )
  }

  const auth = await getPodscarsAuthContext()

  if (auth.user) {
    redirect(next)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <Badge className="bg-slate-950 text-white hover:bg-slate-900">User login</Badge>
          <h1 className="mt-4 font-serif text-5xl text-slate-950 md:text-6xl">Sign in to your Podscars account.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            This is the regular user login for Podscars accounts, profile-based access, and member features.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <AuthForm next={next} errorCode={params.error} />
      </section>
    </div>
  )
}
