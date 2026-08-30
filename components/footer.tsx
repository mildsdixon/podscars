import Link from "next/link"
import { Mail, Ticket, Trophy, Vote } from "lucide-react"
import { PODSCARS_TICKET_URL } from "@/lib/podscars-tickets"

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
            A fan-powered awards experience celebrating podcasters, creators, and film industry talent.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Awards</p>
          <div className="space-y-3 text-slate-600">
            <Link href="/vote" className="flex items-center gap-2 hover:text-slate-950">
              <Vote className="h-4 w-4" />
              Vote Now
            </Link>
            <Link
              href={PODSCARS_TICKET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-slate-950"
            >
              <Ticket className="h-4 w-4" />
              Buy Tickets Now
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Event</p>
          <div className="space-y-3 text-slate-600">
            <p>Friday, October 9, 2026.</p>
            <p>Keep voting, sponsor banners, and event details updated.</p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Use a branded inbox for moderation and winner outreach.
            </p>
          </div>
        </div>
      </div>

    </footer>
  )
}
