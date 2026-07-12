import Link from "next/link"
import { Mail, Mic2, Trophy, Vote } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-2.5 text-amber-300">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-950">The Podscars</p>
              <p className="text-sm text-slate-500">Fan-powered podcast and movie awards</p>
            </div>
          </div>
          <p className="max-w-md text-slate-600">
            A launch-ready concept for collecting nominations, publishing finalists, and running a public awards ballot.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Platform</p>
          <div className="space-y-3 text-slate-600">
            <Link href="/nominate" className="flex items-center gap-2 hover:text-slate-950">
              <Mic2 className="h-4 w-4" />
              Nomination form
            </Link>
            <Link href="/vote" className="flex items-center gap-2 hover:text-slate-950">
              <Vote className="h-4 w-4" />
              Voting ballot
            </Link>
            <Link href="/planning" className="flex items-center gap-2 hover:text-slate-950">
              <Trophy className="h-4 w-4" />
              Organizer planning
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Next Move</p>
          <div className="space-y-3 text-slate-600">
            <p>Pick your official awards year and nomination deadline.</p>
            <p>Keep forms, categories, and ballot content updated.</p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Use a branded inbox for moderation and winner outreach.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 text-sm text-slate-500 md:px-6">
          <p>Podscars platform concept</p>
          <p>Built in Next.js for rapid launch</p>
        </div>
      </div>
    </footer>
  )
}
