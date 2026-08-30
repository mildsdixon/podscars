import "server-only"

import { getPodscarsContent } from "@/lib/podscars-content"
import { getPodscarsLiveData, type LiveNomination, type LiveVote } from "@/lib/podscars-live"

export type NominationLeader = {
  categoryId: string
  categoryTitle: string
  nomineeName: string
  nominationCount: number
  voteCount: number
  latestSubmittedAt: string | null
  statuses: Record<string, number>
  projectTitles: string[]
}

export type NominationLeaderGroup = {
  categoryId: string
  categoryTitle: string
  totalNominations: number
  uniqueNominees: number
  leaders: NominationLeader[]
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

function addStatus(statuses: Record<string, number>, status: string) {
  const label = status.trim() || "New"
  statuses[label] = (statuses[label] || 0) + 1
}

function addProjectTitle(projectTitles: Set<string>, projectTitle: string) {
  const title = projectTitle.trim()

  if (title) {
    projectTitles.add(title)
  }
}

function countVotesByNominee(votes: LiveVote[]) {
  const voteCounts = new Map<string, number>()

  votes.forEach((vote) => {
    const key = `${vote.categoryId}::${normalizeKey(vote.nomineeName)}`
    voteCounts.set(key, (voteCounts.get(key) || 0) + 1)
  })

  return voteCounts
}

function buildNomineeLeaders(nominations: LiveNomination[], votes: LiveVote[]) {
  const voteCounts = countVotesByNominee(votes)
  const grouped = new Map<
    string,
    NominationLeader & {
      projectTitleSet: Set<string>
    }
  >()

  nominations.forEach((nomination) => {
    const key = `${nomination.categoryId}::${normalizeKey(nomination.nomineeName)}`
    const existing = grouped.get(key)

    if (existing) {
      existing.nominationCount += 1
      addStatus(existing.statuses, nomination.status)
      addProjectTitle(existing.projectTitleSet, nomination.projectTitle)

      const currentTime = existing.latestSubmittedAt ? new Date(existing.latestSubmittedAt).getTime() : 0
      const nominationTime = nomination.submittedAt ? new Date(nomination.submittedAt).getTime() : 0

      if (nominationTime > currentTime) {
        existing.latestSubmittedAt = nomination.submittedAt
      }

      return
    }

    const projectTitleSet = new Set<string>()
    addProjectTitle(projectTitleSet, nomination.projectTitle)

    grouped.set(key, {
      categoryId: nomination.categoryId,
      categoryTitle: nomination.categoryTitle,
      nomineeName: nomination.nomineeName.trim() || "Unnamed nominee",
      nominationCount: 1,
      voteCount: voteCounts.get(key) || 0,
      latestSubmittedAt: nomination.submittedAt,
      statuses: {},
      projectTitles: [],
      projectTitleSet,
    })

    addStatus(grouped.get(key)!.statuses, nomination.status)
  })

  return Array.from(grouped.values())
    .map(({ projectTitleSet, ...leader }) => ({
      ...leader,
      projectTitles: Array.from(projectTitleSet).sort((left, right) => left.localeCompare(right)),
    }))
    .sort((left, right) => {
      if (right.nominationCount !== left.nominationCount) {
        return right.nominationCount - left.nominationCount
      }

      if (right.voteCount !== left.voteCount) {
        return right.voteCount - left.voteCount
      }

      return left.nomineeName.localeCompare(right.nomineeName)
    })
}

export async function getNominationLeaderGroups(limit = 5): Promise<{
  groups: NominationLeaderGroup[]
  totals: {
    nominations: number
    uniqueNominees: number
    votes: number
    categories: number
  }
}> {
  const [{ categories }, liveData] = await Promise.all([getPodscarsContent(), getPodscarsLiveData()])
  const leaders = buildNomineeLeaders(liveData.nominations, liveData.votes)
  const leadersByCategory = new Map<string, NominationLeader[]>()
  const nominationsByCategory = new Map<string, number>()

  liveData.nominations.forEach((nomination) => {
    nominationsByCategory.set(nomination.categoryId, (nominationsByCategory.get(nomination.categoryId) || 0) + 1)
  })

  leaders.forEach((leader) => {
    const categoryLeaders = leadersByCategory.get(leader.categoryId) || []
    categoryLeaders.push(leader)
    leadersByCategory.set(leader.categoryId, categoryLeaders)
  })

  const categoryIds = new Set([...categories.map((category) => category.id), ...leadersByCategory.keys()])
  const groups = Array.from(categoryIds)
    .map((categoryId) => {
      const category = categories.find((item) => item.id === categoryId)
      const categoryLeaders = leadersByCategory.get(categoryId) || []
      const categoryTitle = category?.title || categoryLeaders[0]?.categoryTitle || categoryId

      return {
        categoryId,
        categoryTitle,
        totalNominations: nominationsByCategory.get(categoryId) || 0,
        uniqueNominees: categoryLeaders.length,
        leaders: categoryLeaders.slice(0, limit),
      }
    })
    .filter((group) => group.totalNominations > 0 || group.leaders.length > 0)
    .sort((left, right) => left.categoryTitle.localeCompare(right.categoryTitle))

  return {
    groups,
    totals: {
      nominations: liveData.stats.nominations,
      uniqueNominees: leaders.length,
      votes: liveData.stats.votes,
      categories: groups.length,
    },
  }
}
