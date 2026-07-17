import { Sparkles } from "lucide-react"
import { NominationForm } from "@/components/podscars/nomination-form"
import { getAdminSettings } from "@/lib/podscars-admin"
import { getPodscarsContent } from "@/lib/podscars-content"
import {
  NOMINATIONS_CLOSED_MESSAGE,
  NOMINATIONS_DEADLINE_LABEL,
  NOMINATIONS_START_MESSAGE,
  nominationsHaveClosed,
  nominationsHaveStarted,
} from "@/lib/podscars-nominations"

export default async function NominatePage() {
  const { categories } = await getPodscarsContent()
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_30%,#f8fafc_100%)]">
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
            <Sparkles className="h-4 w-4" />
            Podscars nominations
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight text-slate-950 md:text-6xl">
            Nominate your favorites.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Submit picks across {categories.length} categories. Nominations close {NOMINATIONS_DEADLINE_LABEL}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <NominationForm
          categories={categories}
          isOpen={nominationsOpen}
          closedMessage={closedMessage}
        />
      </section>
    </div>
  )
}
