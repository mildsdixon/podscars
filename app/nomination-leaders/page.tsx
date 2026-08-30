import { Award, CalendarClock, Trophy, UsersRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getNominationLeaderGroups } from "@/lib/podscars-nomination-leaders"

export const dynamic = "force-dynamic"

function formatDate(value: string | null) {
  if (!value) {
    return "No date"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value))
}

function formatStatuses(statuses: Record<string, number>) {
  return Object.entries(statuses)
    .map(([status, count]) => `${status}: ${count}`)
    .join(", ")
}

export default async function NominationLeadersPage() {
  const { groups, totals } = await getNominationLeaderGroups(5)

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_34%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <Badge className="bg-slate-950 text-white hover:bg-slate-900">Local preview only</Badge>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight text-slate-950 md:text-6xl">
            Top five nominations in each category.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Ranked by nomination count, then current vote count. This preview is not in the public navigation and has
            not been deployed to DigitalOcean.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-200 bg-white">
              <CardContent className="flex items-center gap-4 p-5">
                <Award className="h-7 w-7 text-[hsl(355,78%,54%)]" />
                <div>
                  <p className="text-sm text-slate-500">Total nominations</p>
                  <p className="text-3xl font-semibold text-slate-950">{totals.nominations}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="flex items-center gap-4 p-5">
                <UsersRound className="h-7 w-7 text-[hsl(355,78%,54%)]" />
                <div>
                  <p className="text-sm text-slate-500">Unique nominees</p>
                  <p className="text-3xl font-semibold text-slate-950">{totals.uniqueNominees}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="flex items-center gap-4 p-5">
                <Trophy className="h-7 w-7 text-[hsl(355,78%,54%)]" />
                <div>
                  <p className="text-sm text-slate-500">Current votes</p>
                  <p className="text-3xl font-semibold text-slate-950">{totals.votes}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="flex items-center gap-4 p-5">
                <CalendarClock className="h-7 w-7 text-[hsl(355,78%,54%)]" />
                <div>
                  <p className="text-sm text-slate-500">Categories with nominations</p>
                  <p className="text-3xl font-semibold text-slate-950">{totals.categories}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        {groups.length ? (
          <div className="grid gap-6">
            {groups.map((group) => (
              <Card key={group.categoryId} className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle className="font-serif text-3xl text-slate-950">{group.categoryTitle}</CardTitle>
                      <p className="mt-2 text-sm text-slate-500">
                        {group.totalNominations} nominations across {group.uniqueNominees} unique nominees
                      </p>
                    </div>
                    <Badge variant="secondary">Top {group.leaders.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                        <tr>
                          <th className="w-16 px-5 py-4">Rank</th>
                          <th className="px-5 py-4">Nominee</th>
                          <th className="px-5 py-4">Nominations</th>
                          <th className="px-5 py-4">Votes</th>
                          <th className="px-5 py-4">Projects</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Latest</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {group.leaders.map((leader, index) => (
                          <tr key={`${leader.categoryId}-${leader.nomineeName}`} className="align-top">
                            <td className="px-5 py-4 font-semibold text-slate-500">#{index + 1}</td>
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-950">{leader.nomineeName}</p>
                            </td>
                            <td className="px-5 py-4">
                              <Badge className="bg-[hsl(355,78%,54%)] text-white hover:bg-[hsl(355,78%,54%)]">
                                {leader.nominationCount}
                              </Badge>
                            </td>
                            <td className="px-5 py-4">
                              <Badge variant="outline">{leader.voteCount}</Badge>
                            </td>
                            <td className="max-w-xs px-5 py-4 text-slate-600">
                              {leader.projectTitles.length ? leader.projectTitles.slice(0, 3).join(", ") : "No project listed"}
                            </td>
                            <td className="px-5 py-4 text-slate-600">{formatStatuses(leader.statuses) || "New"}</td>
                            <td className="px-5 py-4 text-slate-600">{formatDate(leader.latestSubmittedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-8 text-center text-slate-600">
              No nominations were found in the live database yet.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
