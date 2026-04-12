"use client"

import { useState } from "react"
import { LoaderCircle, Save, Settings2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SignOutButton } from "@/components/podscars/sign-out-button"
import type { AdminSettings } from "@/lib/podscars-admin"
import type { LiveNomination, PodscarsLiveData } from "@/lib/podscars-live"

type AdminDashboardProps = {
  initialSettings: AdminSettings
  nominations: LiveNomination[]
  stats: PodscarsLiveData["stats"]
  source: PodscarsLiveData["source"]
  authMode: "password" | "supabase"
}

const nominationStatuses = ["New", "In Review", "Approved", "Finalist", "Rejected"]

export function AdminDashboard({ initialSettings, nominations, stats, source, authMode }: AdminDashboardProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [nominationItems, setNominationItems] = useState(nominations)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const [error, setError] = useState("")
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null)

  async function handleSaveSettings() {
    setSaveState("saving")
    setError("")

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Could not save admin settings.")
        setSaveState("idle")
        return
      }

      setSettings(data.settings)
      setSaveState("saved")
    } catch (settingsError) {
      console.error(settingsError)
      setError("Could not save admin settings.")
      setSaveState("idle")
    }
  }

  async function handleStatusChange(id: string, status: string) {
    setPendingStatusId(id)
    setError("")

    try {
      const response = await fetch("/api/admin/nominations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Could not update nomination status.")
        return
      }

      setNominationItems((current) =>
        current.map((nomination) => (nomination.id === id ? { ...nomination, status } : nomination)),
      )
    } catch (statusError) {
      console.error(statusError)
      setError("Could not update nomination status.")
    } finally {
      setPendingStatusId(null)
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription>Nominations</CardDescription>
            <CardTitle className="text-3xl">{stats.nominations}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription>Votes</CardDescription>
            <CardTitle className="text-3xl">{stats.votes}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardDescription>Unique voters</CardDescription>
            <CardTitle className="text-3xl">{stats.uniqueVoters}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-950 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-300">Data source</CardDescription>
            <CardTitle className="text-3xl capitalize">{source}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-amber-300">
                <Settings2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl text-slate-950">Access controls</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Open or close the public nomination and voting flows instantly.
              </CardDescription>
            </div>
            {authMode === "supabase" ? (
              <SignOutButton next="/" />
            ) : (
              <Button
                variant="outline"
                onClick={async () => {
                  await fetch("/api/admin/session", { method: "DELETE" })
                  window.location.reload()
                }}
              >
                Sign out
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">Nominations open</p>
                  <p className="text-sm text-slate-500">Controls the public `/nominate` form and API.</p>
                </div>
                <Switch
                  checked={settings.nominationsOpen}
                  onCheckedChange={(checked) => {
                    setSettings((current) => ({ ...current, nominationsOpen: checked }))
                    setSaveState("idle")
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="nominations-message">Closed-state message</Label>
                <Textarea
                  id="nominations-message"
                  value={settings.nominationsMessage}
                  onChange={(event) => {
                    setSettings((current) => ({ ...current, nominationsMessage: event.target.value }))
                    setSaveState("idle")
                  }}
                  className="min-h-24"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">Voting open</p>
                  <p className="text-sm text-slate-500">Controls the public `/vote` ballot and vote saving API.</p>
                </div>
                <Switch
                  checked={settings.votingOpen}
                  onCheckedChange={(checked) => {
                    setSettings((current) => ({ ...current, votingOpen: checked }))
                    setSaveState("idle")
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="voting-message">Closed-state message</Label>
                <Textarea
                  id="voting-message"
                  value={settings.votingMessage}
                  onChange={(event) => {
                    setSettings((current) => ({ ...current, votingMessage: event.target.value }))
                    setSaveState("idle")
                  }}
                  className="min-h-24"
                />
              </div>
            </div>

            <Button className="w-full bg-slate-950 text-white hover:bg-slate-800" onClick={handleSaveSettings} disabled={saveState === "saving"}>
              {saveState === "saving" ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving settings
                </>
              ) : saveState === "saved" ? (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Settings saved
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save settings
                </>
              )}
            </Button>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-3xl text-slate-950">Nomination moderation</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Review incoming nominations and move them through your shortlist workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!nominationItems.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                No nominations have been submitted yet.
              </div>
            ) : null}

            {nominationItems.map((nomination) => (
              <div key={nomination.id} className="rounded-3xl border border-slate-200 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-slate-950">{nomination.nomineeName}</p>
                    <p className="text-sm text-slate-500">{nomination.categoryTitle}</p>
                    <p className="text-sm text-slate-600">Submitted by {nomination.submittedBy}</p>
                  </div>
                  <div className="w-full md:w-56">
                    <Label htmlFor={`status-${nomination.id}`}>Status</Label>
                    <Select
                      value={nomination.status}
                      onValueChange={(value) => void handleStatusChange(nomination.id, value)}
                      disabled={pendingStatusId === nomination.id}
                    >
                      <SelectTrigger id={`status-${nomination.id}`} className="mt-2">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        {nominationStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-950">Project</p>
                    <p className="mt-1">{nomination.projectTitle || "No project title provided."}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-950">Record ID</p>
                    <Input value={nomination.id} readOnly className="mt-1 bg-white" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
