import { MonitorPlay } from "lucide-react"
import { NominationForm } from "@/components/podscars/nomination-form"
import { getAdminSettings } from "@/lib/podscars-admin"
import { streamingNominationCategories } from "@/lib/podscars-data"

export default async function StreamingNominationsPage() {
  const settings = await getAdminSettings()

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_30%,#f8fafc_100%)]">
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-900">
            <MonitorPlay className="h-4 w-4" />
            Streaming nominations
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight text-slate-950 md:text-6xl">
            Nominate standout streamers.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Submit streaming creators, live shows, channels, and streaming-first series for review.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <NominationForm
          categories={streamingNominationCategories}
          isOpen={settings.nominationsOpen}
          closedMessage={settings.nominationsMessage}
        />
      </section>
    </div>
  )
}
