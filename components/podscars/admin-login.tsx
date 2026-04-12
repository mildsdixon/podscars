"use client"

import { useState } from "react"
import { LoaderCircle, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AdminLoginProps = {
  configured: boolean
}

export function AdminLogin({ configured }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    if (!configured) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Could not sign in.")
        return
      }

      window.location.reload()
    } catch (loginError) {
      console.error(loginError)
      setError("Could not sign in.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mx-auto max-w-lg border-slate-200 bg-white shadow-xl">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-amber-300">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <CardTitle className="text-3xl text-slate-950">Admin sign in</CardTitle>
        <CardDescription className="text-base text-slate-600">
          Use your admin password to manage nominations and voting access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!configured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            Set `PODSCARS_ADMIN_PASSWORD` in your environment first, then reload this page.
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="admin-password">Admin password</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError("")
            }}
            placeholder="Enter password"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSubmit()
              }
            }}
          />
        </div>

        <Button className="w-full bg-slate-950 text-white hover:bg-slate-800" onClick={handleSubmit} disabled={!configured || isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Signing in
            </>
          ) : (
            "Open admin"
          )}
        </Button>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </CardContent>
    </Card>
  )
}
