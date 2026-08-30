import { VotingBallot } from "@/components/podscars/voting-ballot"
import { getAdminSettings } from "@/lib/podscars-admin"
import { getPodscarsContent } from "@/lib/podscars-content"

export const dynamic = "force-dynamic"

export default async function VotePage() {
  const [{ categories, finalists }, settings] = await Promise.all([getPodscarsContent(), getAdminSettings()])

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fff7e8_42%,#ffffff_100%)]">
      <section className="relative overflow-hidden border-b border-amber-200 bg-white">
        <div className="absolute inset-0 bg-[url('/podscars-artwork/awards-cover.jpg')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_58%,rgba(255,255,255,0.55)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-[#a06d12]">
              Podscars Awards
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-slate-950 md:text-7xl">Vote Now</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Cast your public ballot for the Podscars finalists. Each email can vote once per category for the awards year.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
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
