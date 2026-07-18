import { MonitorPlay } from "lucide-react"
import { NominationForm } from "@/components/podscars/nomination-form"
import { getAdminSettings } from "@/lib/podscars-admin"
import { streamingNominationCategories } from "@/lib/podscars-data"
import {
  NOMINATIONS_CLOSED_MESSAGE,
  NOMINATIONS_DEADLINE_LABEL,
  NOMINATIONS_START_MESSAGE,
  nominationsHaveClosed,
  nominationsHaveStarted,
} from "@/lib/podscars-nominations"

export default async function StreamingNominationsPage() {
  const settings = await getAdminSettings()
  const nominationsStarted = nominationsHaveStarted()
  const nominationsClosed = nominationsHaveClosed()
  const nominationsOpen = settings.nominationsOpen && nominationsStarted && !nominationsClosed
  const closedMessage = !nominationsStarted
    ? NOMINATIONS_START_MESSAGE
    : nominationsClosed
      ? NOMINATIONS_CLOSED_MESSAGE
      : settings.nominationsMessage

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
            Submit movie streaming creators, producers, actors, writers, directors, and more for review. Nominations close{" "}
            {NOMINATIONS_DEADLINE_LABEL}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <NominationForm
          categories={streamingNominationCategories}
          isOpen={nominationsOpen}
          closedMessage={closedMessage}
        />
      </section>
    </div>
  )
}
