"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogIn, Menu, Mic2, MonitorPlay, Trophy, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/", label: "Overview", icon: Trophy },
  { href: "/nominate", label: "Podcast Nominations", icon: Mic2 },
  { href: "/streaming-nominations", label: "Streaming Nominations", icon: MonitorPlay },
  { href: "/vote", label: "Vote", icon: Vote },
  { href: "/planning", label: "Planning", icon: Trophy },
]

const mobileNavItems = [
  ...navItems,
  { href: "/login", label: "User Login", icon: LogIn },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex min-w-0 shrink-0 items-center">
          <img
            src="/podscars-logo.png"
            alt="Podscars"
            className="h-9 w-auto max-w-[160px] object-contain sm:max-w-[190px] lg:h-10 lg:max-w-[220px]"
          />
          <span className="sr-only">The Podscars Awards platform</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-4 lg:flex xl:gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  active ? "text-rose-600" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-2 2xl:flex">
          <Link href="/login">
            <Button size="sm" variant="ghost" className="text-slate-700 hover:bg-slate-100 hover:text-slate-950">
              User login
            </Button>
          </Link>
          <Link href="/nominate">
            <Button size="sm" className="bg-[hsl(355,78%,54%)] text-white hover:bg-[hsl(355,78%,48%)]">
              Open nominations
            </Button>
          </Link>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="mt-8 flex flex-col space-y-4">
              {mobileNavItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 text-lg font-medium ${
                      active ? "text-rose-600" : "text-slate-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <div className="space-y-2 pt-6">
                <Link href="/vote" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Preview voting
                  </Button>
                </Link>
                <Link href="/nominate" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[hsl(355,78%,54%)] text-white hover:bg-[hsl(355,78%,48%)]">
                    Open nominations
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
