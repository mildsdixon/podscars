"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdSpot } from "@/lib/podscars-ads"

type AdvertisingCarouselProps = {
  spots: AdSpot[]
}

export function AdvertisingCarousel({ spots }: AdvertisingCarouselProps) {
  const adSpots = spots.filter((spot) => spot.active)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSpot = adSpots[activeIndex]

  useEffect(() => {
    if (adSpots.length < 2) {
      return
    }

    const rotation = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % adSpots.length)
    }, 5500)

    return () => window.clearInterval(rotation)
  }, [adSpots.length])

  useEffect(() => {
    if (adSpots.length && activeIndex >= adSpots.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, adSpots.length])

  function showPreviousSpot() {
    if (adSpots.length < 2) {
      return
    }

    setActiveIndex((current) => (current - 1 + adSpots.length) % adSpots.length)
  }

  function showNextSpot() {
    if (adSpots.length < 2) {
      return
    }

    setActiveIndex((current) => (current + 1) % adSpots.length)
  }

  if (!activeSpot) {
    return null
  }

  return (
    <section className="w-full border-y border-slate-200 bg-slate-950">
      <div className="relative w-full overflow-hidden">
        <div className="relative aspect-[1200/628] w-full bg-slate-950">
          <img
            key={`${activeSpot.slot}-${activeSpot.imageUrl}`}
            src={activeSpot.imageUrl}
            alt={activeSpot.altText}
            className="h-full w-full object-cover transition duration-500"
          />
        </div>

        {adSpots.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPreviousSpot}
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
              aria-label="Previous advertising spot"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={showNextSpot}
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
              aria-label="Next advertising spot"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {adSpots.map((spot, index) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                activeIndex === index ? "w-10 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75",
              )}
              aria-label={`Go to advertising spot ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
