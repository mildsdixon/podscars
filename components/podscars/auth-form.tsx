"use client"

import { useMemo, useState } from "react"
import { LoaderCircle, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSupabaseBrowserClient } from "@/lib/supabase-browser"

type AuthFormProps = {
  next: string
  errorCode?: string
}

export function AuthForm({ next, errorCode }: AuthFormProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [message, setMessage] = useState(errorCode === "auth_callback_failed" ? "We could not finish that sign-in flow. Please try again." : "")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)

  async function handlePasswordReset() {
    setError("")
    setMessage("")

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError("Enter your email address first so we can send a reset link.")
      return
    }

    setIsSendingReset(true)

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setMessage("Password reset link sent. Check your email for the next step.")
    } catch (resetError) {
      console.error(resetError)
      setError("We could not send a password reset link.")
    } finally {
      setIsSendingReset(false)
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setError("")
    setMessage("")

    try {
      if (mode === "sign-in") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setError(signInError.message)
          return
        }

        window.location.href = next
        return
      }

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setMessage("Account created. Check your email if confirmation is enabled, then sign in.")
      setMode("sign-in")
    } catch (authError) {
      console.error(authError)
      setError("We could not complete that request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mx-auto max-w-lg border-slate-200 bg-white shadow-xl">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-amber-300">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <CardTitle className="text-3xl text-slate-950">{mode === "sign-in" ? "Sign in" : "Create account"}</CardTitle>
        <CardDescription className="text-base text-slate-600">
          Secure account access for Podscars admins and members.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {mode === "sign-up" ? (
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              className="pl-9"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            {mode === "sign-in" ? (
              <button
                type="button"
                className="text-sm font-medium text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-slate-400"
                onClick={handlePasswordReset}
                disabled={isSendingReset}
              >
                {isSendingReset ? "Sending reset..." : "Forgot password?"}
              </button>
            ) : null}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSubmit()
              }
            }}
          />
        </div>

        <Button className="w-full bg-slate-950 text-white hover:bg-slate-800" onClick={handleSubmit} disabled={isSubmitting || isSendingReset}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {mode === "sign-in" ? "Signing in" : "Creating account"}
            </>
          ) : mode === "sign-in" ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-slate-600"
          onClick={() => {
            setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"))
            setError("")
            setMessage("")
          }}
        >
          {mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </Button>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      </CardContent>
    </Card>
  )
}
