import Link from "next/link"
import { Star, Ticket, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdvertisingCarousel } from "@/components/podscars/advertising-carousel"
import { getAdSpots } from "@/lib/podscars-ads"
import { getAdminSettings } from "@/lib/podscars-admin"
import { PODSCARS_TICKET_URL } from "@/lib/podscars-tickets"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [adSpots, settings] = await Promise.all([getAdSpots(), getAdminSettings()])

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-amber-200/70 bg-white">
        <div className="absolute inset-0 bg-[url('/podscars-artwork/awards-hero-1880x940.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.92)_42%,rgba(255,255,255,0.58)_68%,rgba(255,255,255,0.16)_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.34em] text-[#a06d12]">
              <Star className="h-4 w-4 fill-[#c98a1d] text-[#c98a1d]" />
              Honoring excellence in podcasting and streaming
            </div>
            <h1 className="font-serif text-5xl leading-[0.98] text-slate-950 md:text-7xl lg:text-8xl">
              The 4th Annual Podscars Awards
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold uppercase tracking-[0.22em] text-slate-950 md:text-xl">
              Friday, October 9, 2026
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              Celebrate podcasters, creators, and film industry talent with a polished awards-night experience built for fans to vote and support the event.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/vote">
                <Button size="lg" className="w-full bg-[#c90000] px-8 text-white shadow-[0_12px_28px_rgba(201,0,0,0.26)] hover:bg-[#a90000] sm:w-auto">
                  Vote Now
                  <Vote className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={PODSCARS_TICKET_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-[#b78320] bg-white px-8 text-slate-950 hover:bg-amber-50 sm:w-auto"
                >
                  Buy Tickets Now
                  <Ticket className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-7 w-full max-w-[717px] overflow-hidden rounded border border-[#d3a247] bg-white shadow-[0_18px_50px_rgba(160,109,18,0.18)]">
              <div className="aspect-[717/223] w-full bg-slate-100">
                <img
                  src={settings.heroBannerImageUrl}
                  alt={settings.heroBannerAltText}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] lg:block">
            <img
              src="/podscars-artwork/awards-post.jpg"
              alt="Podscars Awards red carpet artwork"
              className="absolute right-0 top-1/2 h-[560px] w-auto -translate-y-1/2 object-contain drop-shadow-[0_30px_60px_rgba(160,109,18,0.26)]"
            />
          </div>
        </div>
      </section>

      <AdvertisingCarousel spots={adSpots} />
    </div>
  )
}
