"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogIn, Menu, Mic2, Shield, Trophy, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/", label: "Overview", icon: Trophy },
  { href: "/nominate", label: "Nominate", icon: Mic2 },
  { href: "/vote", label: "Vote", icon: Vote },
  { href: "/planning", label: "Planning", icon: Trophy },
  { href: "/login", label: "User Login", icon: LogIn },
  { href: "/admin/login", label: "Admin Login", icon: Shield },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-950 p-2.5 text-amber-300">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-950">The Podscars</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Awards platform</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
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
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-700 hover:bg-slate-100 hover:text-slate-950">
              User login
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" className="border-slate-300 text-slate-950 hover:bg-slate-100">
              Admin login
            </Button>
          </Link>
          <Link href="/nominate">
            <Button className="bg-[hsl(355,78%,54%)] text-white hover:bg-[hsl(355,78%,48%)]">Open nominations</Button>
          </Link>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="mt-8 flex flex-col space-y-4">
              {navItems.map((item) => {
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
