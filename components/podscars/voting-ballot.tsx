"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, LoaderCircle, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { PodscarsCategory, PodscarsFinalistGroup } from "@/lib/podscars-data"

type BallotState = Record<string, string>

type VotingBallotProps = {
  categories: PodscarsCategory[]
  finalists: PodscarsFinalistGroup[]
  isOpen: boolean
  closedMessage: string
}

export function VotingBallot({ categories, finalists, isOpen, closedMessage }: VotingBallotProps) {
  const [ballot, setBallot] = useState<BallotState>({})
  const [voterName, setVoterName] = useState("")
  const [voterEmail, setVoterEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const ballotCategories = categories.filter((category) =>
    finalists.some((finalistGroup) => finalistGroup.categoryId === category.id),
  )

  const completedCount = Object.keys(ballot).length
  const completion = ballotCategories.length ? Math.round((completedCount / ballotCategories.length) * 100) : 0

  const selections = useMemo(
    () =>
      ballotCategories.map((category) => ({
        category: category.title,
        nominee: finalists
          .find((group) => group.categoryId === category.id)
          ?.nominees.find((nominee) => nominee.name === ballot[category.id])?.name ?? "No vote yet",
      })),
    [ballot, ballotCategories, finalists],
  )

  async function handleSubmit() {
    setIsSubmitting(true)
    setSubmitted(false)
    setError("")

    try {
      const votes = ballotCategories.map((category) => ({
        categoryId: category.id,
        categoryTitle: category.title,
        nomineeName: ballot[category.id],
      }))

      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voterName,
          voterEmail,
          votes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "We could not save your vote.")
        return
      }

      setSubmitted(true)
    } catch (submissionError) {
      console.error(submissionError)
      setError("We could not save your vote.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl text-slate-950">Public ballot</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  One vote per category. Each submission is saved to Supabase and repeat votes update the existing record.
                </CardDescription>
              </div>
              <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                {completedCount}/{ballotCategories.length} voted
              </div>
            </div>
            <Progress value={completion} className="mt-4 h-2" />
          </CardHeader>
        </Card>

        {!ballotCategories.length ? (
          <Card className="border-dashed border-slate-300 bg-slate-50">
            <CardContent className="p-8">
              <p className="text-lg font-semibold text-slate-950">No finalists published yet</p>
              <p className="mt-2 text-slate-600">
                Add records to the Supabase <span className="font-medium">finalists</span> table and this ballot will
                populate automatically.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {ballotCategories.map((category) => {
          const finalistGroup = finalists.find((group) => group.categoryId === category.id)

          if (!finalistGroup) {
            return null
          }

          return (
            <Card key={category.id} className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={ballot[category.id]}
                  onValueChange={(value) => {
                    setBallot((current) => ({ ...current, [category.id]: value }))
                    setSubmitted(false)
                    setError("")
                  }}
                  className="space-y-3"
                >
                  {finalistGroup.nominees.map((nominee) => (
                    <Label
                      key={nominee.name}
                      htmlFor={`${category.id}-${nominee.name}`}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-[hsl(355,78%,54%)] hover:bg-rose-50"
                    >
                      <RadioGroupItem id={`${category.id}-${nominee.name}`} value={nominee.name} className="mt-1" />
                      <div>
                        <p className="font-semibold text-slate-950">{nominee.name}</p>
                        <p className="text-sm text-slate-500">{nominee.subtitle}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="sticky top-24 h-fit overflow-hidden border-slate-900 bg-slate-950 text-white">
        <CardHeader className="border-b border-white/10">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Vote className="h-6 w-6 text-amber-300" />
          </div>
          <CardTitle className="text-2xl">Ballot summary</CardTitle>
          <CardDescription className="text-slate-300">
            This is the moment where fans feel the event is real. Make the final voting experience dead simple.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Label htmlFor="voterName" className="text-sm text-slate-300">
              Your name
            </Label>
            <Input
              id="voterName"
              className="mt-2 border-white/10 bg-slate-900 text-white placeholder:text-slate-500"
              placeholder="Your name"
              value={voterName}
              onChange={(event) => {
                setVoterName(event.target.value)
                setError("")
              }}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Label htmlFor="voterEmail" className="text-sm text-slate-300">
              Your email
            </Label>
            <Input
              id="voterEmail"
              type="email"
              className="mt-2 border-white/10 bg-slate-900 text-white placeholder:text-slate-500"
              placeholder="you@example.com"
              value={voterEmail}
              onChange={(event) => {
                setVoterEmail(event.target.value)
                setError("")
              }}
            />
          </div>

          {selections.map((selection) => (
            <div key={selection.category} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">{selection.category}</p>
              <p className="mt-1 font-semibold text-white">{selection.nominee}</p>
            </div>
          ))}

          <Button
            className="w-full bg-[hsl(42,96%,54%)] text-slate-950 hover:bg-[hsl(42,96%,48%)]"
            onClick={handleSubmit}
            disabled={isSubmitting || completedCount !== ballotCategories.length || !ballotCategories.length || !isOpen}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Submitting ballot
              </>
            ) : (
              "Submit ballot"
            )}
          </Button>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          {!isOpen ? <p className="text-sm text-amber-300">{closedMessage}</p> : null}

          {submitted ? (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Ballot saved
              </div>
              <p>Your Podscars votes are now being stored live. Submitting again will update your choices.</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
