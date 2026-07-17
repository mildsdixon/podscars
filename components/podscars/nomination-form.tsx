"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Link2, LoaderCircle, Mic2, Popcorn, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { PodscarsCategory } from "@/lib/podscars-data"
import { NOMINATIONS_DEADLINE_LABEL } from "@/lib/podscars-nominations"

const icons = {
  person: Mic2,
  podcast: Sparkles,
  movie: Popcorn,
}

type NominationFormProps = {
  categories: PodscarsCategory[]
  isOpen: boolean
  closedMessage: string
}

export function NominationForm({ categories, isOpen, closedMessage }: NominationFormProps) {
  const [form, setForm] = useState({
    categoryId: categories[0]?.id || "",
    nomineeName: "",
    projectTitle: "",
    link: "",
    reason: "",
    submittedBy: "",
    submitterEmail: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categoryId) ?? categories[0],
    [categories, form.categoryId],
  )

  if (!selectedCategory) {
    return null
  }

  const CategoryIcon = icons[selectedCategory.type]

  async function handleSubmit() {
    setIsSubmitting(true)
    setError("")
    setSubmitted(false)

    try {
      const response = await fetch("/api/nominations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          categoryTitle: selectedCategory.title,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "We could not save your nomination.")
        return
      }

      setSubmitted(true)
      setForm((current) => ({
        ...current,
        nomineeName: "",
        projectTitle: "",
        link: "",
        reason: "",
        submittedBy: "",
        submitterEmail: "",
      }))
    } catch (submissionError) {
      console.error(submissionError)
      setError("We could not save your nomination.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-white/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950">Submit a nomination</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Pick a category, name the nominee, and tell us why they deserve the Podscars spotlight. One email can
            submit once per category. Nominations close {NOMINATIONS_DEADLINE_LABEL}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.categoryId}
              onValueChange={(value) => {
                setForm((current) => ({ ...current, categoryId: value }))
                setSubmitted(false)
                setError("")
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500">{selectedCategory.nominationPrompt}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nomineeName">Nominee name</Label>
              <Input
                id="nomineeName"
                placeholder="Name of person, podcast, or film"
                value={form.nomineeName}
                onChange={(event) => {
                  setForm((current) => ({ ...current, nomineeName: event.target.value }))
                  setError("")
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectTitle">Associated show or release</Label>
              <Input
                id="projectTitle"
                placeholder="Podcast title, movie title, or episode"
                value={form.projectTitle}
                onChange={(event) => {
                  setForm((current) => ({ ...current, projectTitle: event.target.value }))
                  setError("")
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Reference link (optional)</Label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="link"
                className="pl-9"
                placeholder="Podcast page, trailer, IMDb, press link, or social post"
                value={form.link}
                onChange={(event) => {
                  setForm((current) => ({ ...current, link: event.target.value }))
                  setError("")
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Why this nominee? (optional)</Label>
            <Textarea
              id="reason"
              placeholder="What made them stand out this year? Mention chemistry, impact, originality, fandom, or a specific moment."
              className="min-h-32"
              value={form.reason}
              onChange={(event) => {
                setForm((current) => ({ ...current, reason: event.target.value }))
                setError("")
              }}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="submitterEmail">Your email</Label>
              <Input
                id="submitterEmail"
                type="email"
                placeholder="you@example.com"
                value={form.submitterEmail}
                onChange={(event) => {
                  setForm((current) => ({ ...current, submitterEmail: event.target.value }))
                  setError("")
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="submittedBy">Your name or handle</Label>
              <Input
                id="submittedBy"
                placeholder="@yourhandle or your name"
                value={form.submittedBy}
                onChange={(event) => {
                  setForm((current) => ({ ...current, submittedBy: event.target.value }))
                  setError("")
                }}
              />
            </div>
          </div>

          <Button
            className="w-full bg-[hsl(355,78%,54%)] text-white hover:bg-[hsl(355,78%,48%)]"
            onClick={handleSubmit}
            disabled={isSubmitting || !isOpen}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Submitting nomination
              </>
            ) : (
              "Submit nomination"
            )}
          </Button>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {!isOpen ? <p className="text-sm text-amber-700">{closedMessage}</p> : null}

          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Nomination received
              </div>
              <p>
                <span className="font-semibold">Your nominee</span> is lined up for{" "}
                <span className="font-semibold">{selectedCategory.title}</span>.
              </p>
              <p className="mt-1 text-emerald-800">This submission is now being stored live for review.</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-900/10 bg-slate-950 text-white">
        <CardHeader className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.28),_transparent_45%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.96))]">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <CategoryIcon className="h-6 w-6 text-amber-300" />
          </div>
          <CardTitle className="text-2xl">{selectedCategory.title}</CardTitle>
          <CardDescription className="text-slate-300">{selectedCategory.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-6 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold text-white">What makes a strong nomination</p>
            <p className="mt-2">
              A recognizable nominee name and show or release title are enough to submit. Add a link or note only when
              it helps your review team verify the entry faster.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold text-white">Suggested moderation rule</p>
            <p className="mt-2">
              Each email can submit one nomination per category. The review team can still combine duplicate nominees
              before finalists are announced.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold text-white">Launch recommendation</p>
            <p className="mt-2">
              Nominations close {NOMINATIONS_DEADLINE_LABEL}. After review, publish 3 to 5 finalists per category for
              the public ballot.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
