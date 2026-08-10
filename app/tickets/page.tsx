import Link from "next/link"
import { ArrowRight, CalendarDays, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_42%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-20">
          <Badge className="bg-slate-950 text-white hover:bg-slate-900">Podscars Tickets</Badge>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight text-slate-950 md:text-7xl">
            Buy tickets for the Podscars.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Ticket checkout is being connected. Please check back here for the official purchase link.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6 md:p-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(355,78%,54%)] text-white">
              <Ticket className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-3xl text-slate-950">Ticket sales are almost ready.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              This page is ready for the final ticket checkout link. Once the purchase URL is added, the Buy Tickets Now
              buttons will send guests straight to checkout.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-950 bg-slate-950 text-white">
          <CardContent className="p-6 md:p-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-3xl">Stay close to the awards.</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Nominations are open until August 17, 2026. Submit your podcast or streaming nomination while ticket sales
              are being finalized.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/nominate">
                <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 sm:w-auto">
                  Podcast Nominations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/streaming-nominations">
                <Button variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                  Streaming Nominations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
