"use client"

import { useState } from "react"
import { ImageIcon, LoaderCircle, Save, Settings2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SignOutButton } from "@/components/podscars/sign-out-button"
import type { AdSpot } from "@/lib/podscars-ads"
import type { AdminSettings } from "@/lib/podscars-admin"
import type { PodscarsCategory } from "@/lib/podscars-data"
import type { LiveNomination, PodscarsLiveData } from "@/lib/podscars-live"

type AdminDashboardProps = {
  initialSettings: AdminSettings
  nominations: LiveNomination[]
  categories: PodscarsCategory[]
  contentSource: "fallback" | "supabase"
  stats: PodscarsLiveData["stats"]
  source: PodscarsLiveData["source"]
  authMode: "password" | "supabase"
  initialAdSpots: AdSpot[]
}

const nominationStatuses = ["New", "In Review", "Approved", "Finalist", "Rejected"]
const categoryTypes = [
  { value: "person", label: "People" },
  { value: "podcast", label: "Podcasts" },
  { value: "movie", label: "Movies" },
] as const

export function AdminDashboard({
  initialSettings,
  nominations,
  categories,
  contentSource,
  stats,
  source,
  authMode,
  initialAdSpots,
}: AdminDashboardProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [nominationItems, setNominationItems] = useState(nominations)
  const [categoryItems, setCategoryItems] = useState(categories)
  const [adSpotItems, setAdSpotItems] = useState(initialAdSpots)
  const [categoryForm, setCategoryForm] = useState({
    title: "",
    type: "podcast" as PodscarsCategory["type"],
    description: "",
    nominationPrompt: "",
  })
  const [categorySaveState, setCategorySaveState] = useState<"idle" | "saving" | "saved" | "preview">("idle")
  const [adSaveState, setAdSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const [uploadingAdId, setUploadingAdId] = useState<number | null>(null)
  const [bannerUploadState, setBannerUploadState] = useState<"idle" | "uploading" | "saved">("idle")
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

  async function handleAddCategory() {
    setCategorySaveState("saving")
    setError("")

    if (!categoryForm.title || !categoryForm.description || !categoryForm.nominationPrompt) {
      setError("Add a title, description, and nomination prompt for the category.")
      setCategorySaveState("idle")
      return
    }

    if (contentSource === "fallback") {
      setCategoryItems((current) => [
        ...current,
        {
          id: categoryForm.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
          ...categoryForm,
        },
      ])
      setCategoryForm({ title: "", type: "podcast", description: "", nominationPrompt: "" })
      setCategorySaveState("preview")
      return
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryForm),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Could not save category.")
        setCategorySaveState("idle")
        return
      }

      setCategoryItems((current) => [...current, data.category])
      setCategoryForm({ title: "", type: "podcast", description: "", nominationPrompt: "" })
      setCategorySaveState("saved")
    } catch (categoryError) {
      console.error(categoryError)
      setError("Could not save category.")
      setCategorySaveState("idle")
    }
  }

  async function handleSaveAdSpots() {
    setAdSaveState("saving")
    setError("")

    try {
      const response = await fetch("/api/admin/ad-spots", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spots: adSpotItems }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Could not save advertising spots.")
        setAdSaveState("idle")
        return
      }

      setAdSpotItems(data.spots)
      setAdSaveState("saved")
    } catch (adError) {
      console.error(adError)
      setError("Could not save advertising spots.")
      setAdSaveState("idle")
    }
  }

  async function handleAdImageUpload(spot: AdSpot, file: File | undefined) {
    if (!file) {
      return
    }

    setUploadingAdId(spot.id)
    setAdSaveState("idle")
    setError("")

    try {
      const formData = new FormData()
      formData.append("slot", String(spot.slot))
      formData.append("file", file)

      const response = await fetch("/api/admin/ad-spots/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Could not upload ad image.")
        return
      }

      setAdSpotItems((current) =>
        current.map((item) =>
          item.id === spot.id
            ? data.spot || {
                ...item,
                imageUrl: data.url,
                altText: data.altText || item.altText,
                active: true,
              }
            : item,
        ),
      )
      setAdSaveState("saved")
    } catch (uploadError) {
      console.error(uploadError)
      setError("Could not upload ad image.")
    } finally {
      setUploadingAdId(null)
    }
  }

  async function handleHeroBannerUpload(file: File | undefined) {
    if (!file) {
      return
    }

    setBannerUploadState("uploading")
    setSaveState("idle")
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/hero-banner/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Could not upload homepage banner.")
        setBannerUploadState("idle")
        return
      }

      setSettings(data.settings)
      setBannerUploadState("saved")
      setSaveState("saved")
    } catch (uploadError) {
      console.error(uploadError)
      setError("Could not upload homepage banner.")
      setBannerUploadState("idle")
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
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
      </section>

      <Card className="bg-white">
        <CardHeader>
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-amber-300">
            <ImageIcon className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl text-slate-950">Advertising</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Manage the five 1200 x 628 homepage slideshow ads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 rounded-3xl border border-slate-200 p-5 lg:grid-cols-[minmax(0,717px)_1fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={settings.heroBannerImageUrl}
                alt={settings.heroBannerAltText}
                className="aspect-[717/223] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/placeholder.jpg"
                }}
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-950">Homepage banner</p>
                <p className="text-sm text-slate-500">Appears under the homepage intro copy. Best size: 717 x 223.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-banner-file">Upload JPG/PNG</Label>
                <Input
                  id="hero-banner-file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                  disabled={bannerUploadState === "uploading"}
                  onChange={(event) => {
                    void handleHeroBannerUpload(event.target.files?.[0])
                    event.target.value = ""
                  }}
                />
                {bannerUploadState === "uploading" ? (
                  <p className="flex items-center text-sm text-slate-500">
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Uploading banner
                  </p>
                ) : bannerUploadState === "saved" ? (
                  <p className="text-sm font-medium text-emerald-700">Banner saved</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-banner-url">Image URL</Label>
                <Input
                  id="hero-banner-url"
                  value={settings.heroBannerImageUrl}
                  onChange={(event) => {
                    setSettings((current) => ({ ...current, heroBannerImageUrl: event.target.value }))
                    setSaveState("idle")
                    setBannerUploadState("idle")
                  }}
                  placeholder="/path-or-https-url.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-banner-alt">Alt text</Label>
                <Input
                  id="hero-banner-alt"
                  value={settings.heroBannerAltText}
                  onChange={(event) => {
                    setSettings((current) => ({ ...current, heroBannerAltText: event.target.value }))
                    setSaveState("idle")
                    setBannerUploadState("idle")
                  }}
                  placeholder="Sponsor banner description"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-5">
            {adSpotItems.map((spot, index) => (
              <div key={spot.id} className="space-y-4 rounded-3xl border border-slate-200 p-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={spot.imageUrl}
                    alt={spot.altText}
                    className="aspect-[1200/628] w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder.jpg"
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">Ad spot {index + 1}</p>
                  <Switch
                    checked={spot.active}
                    onCheckedChange={(checked) => {
                      setAdSpotItems((current) =>
                        current.map((item) => (item.id === spot.id ? { ...item, active: checked } : item)),
                      )
                      setAdSaveState("idle")
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ad-file-${spot.id}`}>Upload JPG/PNG</Label>
                  <Input
                    id={`ad-file-${spot.id}`}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                    disabled={uploadingAdId === spot.id}
                    onChange={(event) => {
                      void handleAdImageUpload(spot, event.target.files?.[0])
                      event.target.value = ""
                    }}
                  />
                  <p className="text-xs text-slate-500">JPG or PNG only. Best size: 1200 x 628.</p>
                  {uploadingAdId === spot.id ? (
                    <p className="flex items-center text-sm text-slate-500">
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Uploading image
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ad-url-${spot.id}`}>Image URL</Label>
                  <Input
                    id={`ad-url-${spot.id}`}
                    value={spot.imageUrl}
                    onChange={(event) => {
                      setAdSpotItems((current) =>
                        current.map((item) => (item.id === spot.id ? { ...item, imageUrl: event.target.value } : item)),
                      )
                      setAdSaveState("idle")
                    }}
                    placeholder="/path-or-https-url.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ad-alt-${spot.id}`}>Alt text</Label>
                  <Input
                    id={`ad-alt-${spot.id}`}
                    value={spot.altText}
                    onChange={(event) => {
                      setAdSpotItems((current) =>
                        current.map((item) => (item.id === spot.id ? { ...item, altText: event.target.value } : item)),
                      )
                      setAdSaveState("idle")
                    }}
                    placeholder="Sponsor ad description"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-slate-950 text-white hover:bg-slate-800" onClick={handleSaveAdSpots} disabled={adSaveState === "saving"}>
            {adSaveState === "saving" ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Saving ads
              </>
            ) : adSaveState === "saved" ? (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Ads saved
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save advertising spots
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-3xl text-slate-950">Nomination categories</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Add the categories fans can choose from on the nomination form.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-3xl border border-slate-200 p-5">
            <div className="space-y-2">
              <Label htmlFor="category-title">Category title</Label>
              <Input
                id="category-title"
                value={categoryForm.title}
                onChange={(event) => {
                  setCategoryForm((current) => ({ ...current, title: event.target.value }))
                  setCategorySaveState("idle")
                }}
                placeholder="Best New Podcast"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-type">Category type</Label>
              <Select
                value={categoryForm.type}
                onValueChange={(value: PodscarsCategory["type"]) => {
                  setCategoryForm((current) => ({ ...current, type: value }))
                  setCategorySaveState("idle")
                }}
              >
                <SelectTrigger id="category-type">
                  <SelectValue placeholder="Choose a type" />
                </SelectTrigger>
                <SelectContent>
                  {categoryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(event) => {
                  setCategoryForm((current) => ({ ...current, description: event.target.value }))
                  setCategorySaveState("idle")
                }}
                placeholder="What this award recognizes."
                className="min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-prompt">Nomination prompt</Label>
              <Textarea
                id="category-prompt"
                value={categoryForm.nominationPrompt}
                onChange={(event) => {
                  setCategoryForm((current) => ({ ...current, nominationPrompt: event.target.value }))
                  setCategorySaveState("idle")
                }}
                placeholder="Nominate a show, host, movie, or creator."
                className="min-h-24"
              />
            </div>

            <Button className="w-full bg-slate-950 text-white hover:bg-slate-800" onClick={handleAddCategory} disabled={categorySaveState === "saving"}>
              {categorySaveState === "saving" ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving category
                </>
              ) : categorySaveState === "saved" ? (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Category saved
                </>
              ) : categorySaveState === "preview" ? (
                "Added to preview"
              ) : (
                "Add category"
              )}
            </Button>

            {contentSource === "fallback" ? (
              <p className="text-sm text-amber-700">
                This preview is not connected to live data, so added categories only appear until the page refreshes.
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            {categoryItems.map((category) => (
              <div key={category.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{category.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{category.description}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                    {category.type}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500">{category.nominationPrompt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

            <div className="rounded-3xl border border-slate-200 p-5">
              <div>
                <p className="font-semibold text-slate-950">Homepage flow copy</p>
                <p className="text-sm text-slate-500">Edits the public “How It Works” section on the homepage.</p>
              </div>
              <div className="mt-4 grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homepage-flow-eyebrow">Eyebrow</Label>
                  <Input
                    id="homepage-flow-eyebrow"
                    value={settings.homepageFlowEyebrow}
                    onChange={(event) => {
                      setSettings((current) => ({ ...current, homepageFlowEyebrow: event.target.value }))
                      setSaveState("idle")
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homepage-flow-title">Title</Label>
                  <Input
                    id="homepage-flow-title"
                    value={settings.homepageFlowTitle}
                    onChange={(event) => {
                      setSettings((current) => ({ ...current, homepageFlowTitle: event.target.value }))
                      setSaveState("idle")
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homepage-flow-summary">Summary</Label>
                  <Textarea
                    id="homepage-flow-summary"
                    value={settings.homepageFlowSummary}
                    onChange={(event) => {
                      setSettings((current) => ({ ...current, homepageFlowSummary: event.target.value }))
                      setSaveState("idle")
                    }}
                    className="min-h-20"
                  />
                </div>
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
