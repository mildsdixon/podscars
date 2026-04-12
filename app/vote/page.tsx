import { VotingBallot } from "@/components/podscars/voting-ballot"
import { getAdminSettings } from "@/lib/podscars-admin"
import { getPodscarsContent } from "@/lib/podscars-content"

export default async function VotePage() {
  const { categories, finalists } = await getPodscarsContent()
  const settings = await getAdminSettings()

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_25%,#fff7ed_100%)]">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Public Voting</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-6xl">
            Vote for the winners.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            One vote per category.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <VotingBallot
          categories={categories}
          finalists={finalists}
          isOpen={settings.votingOpen}
          closedMessage={settings.votingMessage}
        />
      </section>
    </div>
  )
}
