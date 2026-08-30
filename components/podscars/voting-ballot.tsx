"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { PodscarsCategory, PodscarsFinalistGroup } from "@/lib/podscars-data"

type BallotState = Record<string, string>
type DuplicateAction = "keep" | "overwrite"

type DuplicateVote = {
  categoryId: string
  categoryTitle: string
  existingNomineeName: string
  newNomineeName: string
  awardYear: number
}

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
  const [duplicateVotes, setDuplicateVotes] = useState<DuplicateVote[]>([])

  const ballotCategories = categories.filter((category) =>
    finalists.some((finalistGroup) => finalistGroup.categoryId === category.id && finalistGroup.nominees.length),
  )
  const completedCount = Object.values(ballot).filter(Boolean).length
  const canSubmit = Boolean(voterName.trim() && voterEmail.trim() && completedCount > 0 && isOpen)

  const selections = useMemo(
    () =>
      ballotCategories
        .filter((category) => ballot[category.id])
        .map((category) => ({
          id: category.id,
          category: category.title,
          nominee: finalists
            .find((group) => group.categoryId === category.id)
            ?.nominees.find((nominee) => nominee.name === ballot[category.id])?.name,
        })),
    [ballot, ballotCategories, finalists],
  )

  async function handleSubmit(duplicateAction?: DuplicateAction) {
    setIsSubmitting(true)
    setSubmitted(false)
    setError("")

    try {
      const votes = ballotCategories
        .filter((category) => ballot[category.id])
        .map((category) => ({
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
          duplicateAction,
        }),
      })

      const data = await response.json()

      if (response.status === 409 && Array.isArray(data.duplicateVotes)) {
        setDuplicateVotes(data.duplicateVotes)
        return
      }

      if (!response.ok) {
        setError(data.error || "We could not save your vote.")
        return
      }

      setSubmitted(true)
      setDuplicateVotes([])
    } catch (submissionError) {
      console.error(submissionError)
      setError("We could not save your vote.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded border border-amber-200 bg-white shadow-[0_18px_45px_rgba(160,109,18,0.08)]">
        <div className="border-b border-amber-200 p-5 sm:p-7">
          <h2 className="font-serif text-4xl leading-tight text-slate-950">Podscars Voting Ballot</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Choose one nominee in any category you want to vote in. You do not have to answer every category.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            If your email already voted in a category, you can keep the old choice or replace it.
          </p>
        </div>

        <div className="space-y-5 border-b border-amber-200 bg-[#fffaf0] p-5 sm:p-7">
          <div className="space-y-2">
            <Label htmlFor="voterName" className="text-base font-semibold text-slate-950">
              Your name
            </Label>
            <Input
              id="voterName"
              className="h-12 border-amber-200 bg-white text-base"
              placeholder="Your name"
              value={voterName}
              onChange={(event) => {
                setVoterName(event.target.value)
                setError("")
                setDuplicateVotes([])
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voterEmail" className="text-base font-semibold text-slate-950">
              Your email
            </Label>
            <Input
              id="voterEmail"
              type="email"
              className="h-12 border-amber-200 bg-white text-base"
              placeholder="you@example.com"
              value={voterEmail}
              onChange={(event) => {
                setVoterEmail(event.target.value)
                setError("")
                setDuplicateVotes([])
              }}
            />
          </div>
        </div>

        {!ballotCategories.length ? (
          <div className="border-b border-amber-100 p-5 sm:p-7">
            <p className="text-lg font-semibold text-slate-950">No ballot choices published yet</p>
            <p className="mt-2 text-slate-600">
              Add finalists in the admin backend and this ballot will populate automatically.
            </p>
          </div>
        ) : null}

        {ballotCategories.map((category, index) => {
          const finalistGroup = finalists.find((group) => group.categoryId === category.id)
          const startsStreamingSection =
            category.id.startsWith("streaming-") && !ballotCategories[index - 1]?.id.startsWith("streaming-")

          if (!finalistGroup) {
            return null
          }

          return (
            <div key={category.id}>
              {startsStreamingSection ? (
                <div className="border-y border-[#d3a247] bg-[linear-gradient(90deg,#fff7e8_0%,#ffffff_52%,#fff1d1_100%)] px-5 py-7 text-center sm:px-7">
                  <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-[#a06d12]">Streaming Category</p>
                  <h3 className="mt-2 font-serif text-4xl leading-tight text-[#c90000] sm:text-5xl">Streaming</h3>
                </div>
              ) : null}
              <fieldset className="border-b border-amber-100 p-5 sm:p-7">
                <legend className="text-xl font-bold text-slate-950">{category.title}</legend>
                {category.description ? <p className="mt-1 text-sm leading-6 text-slate-500">{category.description}</p> : null}
                <div className="mt-5">
                  <RadioGroup
                    value={ballot[category.id]}
                    onValueChange={(value) => {
                      setBallot((current) => ({ ...current, [category.id]: value }))
                      setSubmitted(false)
                      setError("")
                      setDuplicateVotes([])
                    }}
                    className="space-y-2"
                  >
                    {finalistGroup.nominees.map((nominee) => (
                      <Label
                        key={nominee.name}
                        htmlFor={`${category.id}-${nominee.name}`}
                        className="flex cursor-pointer items-start gap-3 rounded border border-slate-200 bg-white p-4 text-base transition hover:border-[#c90000] hover:bg-red-50"
                      >
                        <RadioGroupItem id={`${category.id}-${nominee.name}`} value={nominee.name} className="mt-1 border-slate-400 text-[#c90000]" />
                        <div>
                          <p className="font-semibold text-slate-950">{nominee.name}</p>
                          {nominee.subtitle ? <p className="text-sm text-slate-500">{nominee.subtitle}</p> : null}
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </fieldset>
            </div>
          )
        })}

        {completedCount ? (
          <div className="border-b border-amber-100 bg-white p-5 sm:p-7">
            <p className="font-semibold text-slate-950">Your selections</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {selections.map((selection) => (
                <p key={selection.id}>
                  <span className="font-medium text-slate-950">{selection.category}:</span> {selection.nominee}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 p-5 sm:p-7">
          <Button
            className="h-12 w-full bg-[#c90000] text-base font-bold text-white hover:bg-[#a90000]"
            onClick={() => handleSubmit()}
            disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Submitting vote
              </>
            ) : (
              "Submit Vote"
            )}
          </Button>

          {!completedCount ? <p className="text-sm text-slate-500">Select at least one category to submit your vote.</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {!isOpen ? <p className="text-sm font-medium text-amber-700">{closedMessage}</p> : null}

          {submitted ? (
            <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Vote saved
              </div>
              <p>Your Podscars vote has been stored.</p>
            </div>
          ) : null}
        </div>
      </div>

      <AlertDialog open={duplicateVotes.length > 0} onOpenChange={(open) => !open && setDuplicateVotes([])}>
        <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>You already voted in this category</AlertDialogTitle>
            <AlertDialogDescription>
              This email has an existing vote for the same category this year. Choose whether to keep the old selection
              or overwrite it with the new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {duplicateVotes.map((duplicate) => (
              <div key={duplicate.categoryId} className="rounded border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{duplicate.categoryTitle}</p>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Current vote</p>
                    <p className="font-medium text-slate-900">{duplicate.existingNomineeName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">New selection</p>
                    <p className="font-medium text-slate-900">{duplicate.newNomineeName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-slate-950 text-white hover:bg-slate-800"
              disabled={isSubmitting}
              onClick={() => handleSubmit("keep")}
            >
              Keep old selection
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-[#c90000] text-white hover:bg-[#a90000]"
              disabled={isSubmitting}
              onClick={() => handleSubmit("overwrite")}
            >
              Replace with new choice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
