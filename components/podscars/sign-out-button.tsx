"use client"

import { useMemo, useState } from "react"
import { LoaderCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase-browser"

type SignOutButtonProps = {
  next?: string
}

export function SignOutButton({ next = "/" }: SignOutButtonProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSignOut() {
    setIsSubmitting(true)

    try {
      await supabase.auth.signOut()
      window.location.href = next
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isSubmitting}>
      {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Sign out
    </Button>
  )
}
