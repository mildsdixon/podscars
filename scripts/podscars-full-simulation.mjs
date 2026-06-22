#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@supabase/supabase-js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue
    }

    const [key, ...valueParts] = trimmed.split("=")
    const rawValue = valueParts.join("=")
    const value = rawValue.replace(/^['"]|['"]$/g, "")

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(path.join(rootDir, ".env.local"))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const baseUrl = process.env.PODSCARS_SIMULATION_BASE_URL || "http://localhost:3000"
const runId = process.env.PODSCARS_SIMULATION_RUN_ID || `sim-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`
const awardYear = Number(process.env.PODSCARS_SIMULATION_AWARD_YEAR || new Date().getFullYear())
const requiredFinalistsPerCategory = Number(process.env.PODSCARS_REQUIRED_FINALISTS_PER_CATEGORY || 5)
const nominationsPerCategory = Math.ceil(requiredFinalistsPerCategory * 1.2)
const shouldCleanup = process.env.PODSCARS_SIMULATION_CLEANUP !== "false"
const emailDomain = "podscars-sim.test"

const streamingCategories = [
  ["best-actor", "Best Actor"],
  ["best-actress", "Best Actress"],
  ["best-editor", "Best Editor"],
  ["best-producer", "Best Producer"],
  ["best-writer", "Best Writer"],
  ["best-villain", "Best Villain"],
  ["best-director", "Best Director"],
  ["best-movie", "Best Movie"],
  ["best-supporting-actress", "Best Supporting Actress"],
  ["best-supporting-actor", "Best Supporting Actor"],
  ["best-director-of-photography", "Best Director of Photography"],
].map(([id, title]) => ({ id, title }))

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables. Check .env.local.")
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

async function apiPost(pathname, payload) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await response.json().catch(() => ({}))

  return { response, body }
}

function assertApiOk(result, context) {
  if (!result.response.ok) {
    throw new Error(`${context} failed with ${result.response.status}: ${JSON.stringify(result.body)}`)
  }
}

async function cleanupRun() {
  await supabase.from("votes").delete().eq("award_year", awardYear).like("voter_email", `%+${runId}@${emailDomain}`)
  await supabase.from("nominations").delete().like("submitter_email", `%+${runId}@${emailDomain}`)
  await supabase.from("finalists").delete().like("subtitle", `%${runId}%`)
}

async function main() {
  await cleanupRun()

  const { data: settings, error: settingsError } = await supabase
    .from("admin_settings")
    .select("nominations_open, voting_open")
    .eq("id", 1)
    .maybeSingle()

  if (settingsError) {
    throw settingsError
  }

  if (!settings?.nominations_open || !settings?.voting_open) {
    throw new Error("Nominations and voting must both be open for the public-flow simulation.")
  }

  const { data: liveCategories, error: categoryError } = await supabase
    .from("categories")
    .select("id, title")
    .eq("active", true)
    .order("sort_order", { ascending: true })

  if (categoryError) {
    throw categoryError
  }

  if (!liveCategories?.length) {
    throw new Error("No active Supabase categories found.")
  }

  const nominationCategories = [...liveCategories, ...streamingCategories]
  const nominationResults = []

  for (const category of nominationCategories) {
    for (let index = 1; index <= nominationsPerCategory; index += 1) {
      const nomineeName = `${runId} ${category.title} Nominee ${index}`
      const result = await apiPost("/api/nominations", {
        categoryId: category.id,
        categoryTitle: category.title,
        nomineeName,
        projectTitle: `${category.title} Project ${index}`,
        link: `https://example.com/${runId}/${category.id}/${index}`,
        reason: `Simulation nomination ${index} for ${category.title}.`,
        submittedBy: `Simulation Voter ${index}`,
        submitterEmail: `nomination-${category.id}-${index}+${runId}@${emailDomain}`,
      })

      assertApiOk(result, `Nomination ${category.id} #${index}`)
      nominationResults.push({ categoryId: category.id, recordId: result.body.recordId })
    }
  }

  const finalistRows = liveCategories.flatMap((category) =>
    Array.from({ length: requiredFinalistsPerCategory }, (_, index) => ({
      category_id: category.id,
      name: `${runId} ${category.title} Finalist ${index + 1}`,
      subtitle: `Simulation finalist ${index + 1} for ${runId}`,
      active: true,
      sort_order: index,
    })),
  )
  const { error: finalistError } = await supabase.from("finalists").insert(finalistRows)

  if (finalistError) {
    throw finalistError
  }

  const ballotVoters = Array.from({ length: 8 }, (_, index) => ({
    voterName: `Simulation Ballot ${index + 1}`,
    voterEmail: `ballot-${index + 1}+${runId}@${emailDomain}`,
    votes: liveCategories.map((category, categoryIndex) => ({
      categoryId: category.id,
      categoryTitle: category.title,
      nomineeName: `${runId} ${category.title} Finalist ${((index + categoryIndex) % requiredFinalistsPerCategory) + 1}`,
    })),
    awardYear,
  }))

  for (const voter of ballotVoters) {
    const result = await apiPost("/api/votes", voter)
    assertApiOk(result, `Ballot for ${voter.voterEmail}`)
  }

  const cheatEmail = `cheat-attempt+${runId}@${emailDomain}`
  const cheatCategory = liveCategories[0]
  const initialCheat = await apiPost("/api/votes", {
    voterName: "Simulation Cheat Attempt",
    voterEmail: cheatEmail,
    awardYear,
    votes: [
      {
        categoryId: cheatCategory.id,
        categoryTitle: cheatCategory.title,
        nomineeName: `${runId} ${cheatCategory.title} Finalist 1`,
      },
    ],
  })
  assertApiOk(initialCheat, "Initial cheat-control vote")

  const blockedCheat = await apiPost("/api/votes", {
    voterName: "Simulation Cheat Attempt",
    voterEmail: cheatEmail,
    awardYear,
    votes: [
      {
        categoryId: cheatCategory.id,
        categoryTitle: cheatCategory.title,
        nomineeName: `${runId} ${cheatCategory.title} Finalist 2`,
      },
    ],
  })

  if (blockedCheat.response.status !== 409 || !Array.isArray(blockedCheat.body.duplicateVotes)) {
    throw new Error(`Expected duplicate vote to return 409, got ${blockedCheat.response.status}: ${JSON.stringify(blockedCheat.body)}`)
  }

  const keepCheat = await apiPost("/api/votes", {
    voterName: "Simulation Cheat Attempt",
    voterEmail: cheatEmail,
    awardYear,
    duplicateAction: "keep",
    votes: [
      {
        categoryId: cheatCategory.id,
        categoryTitle: cheatCategory.title,
        nomineeName: `${runId} ${cheatCategory.title} Finalist 2`,
      },
    ],
  })
  assertApiOk(keepCheat, "Duplicate keep action")

  const overwriteCheat = await apiPost("/api/votes", {
    voterName: "Simulation Cheat Attempt",
    voterEmail: cheatEmail,
    awardYear,
    duplicateAction: "overwrite",
    votes: [
      {
        categoryId: cheatCategory.id,
        categoryTitle: cheatCategory.title,
        nomineeName: `${runId} ${cheatCategory.title} Finalist 3`,
      },
    ],
  })

  if (overwriteCheat.response.status !== 409) {
    throw new Error(`Expected overwrite attempt to return 409, got ${overwriteCheat.response.status}: ${JSON.stringify(overwriteCheat.body)}`)
  }

  const { data: nominationCounts, error: nominationCountError } = await supabase
    .from("nominations")
    .select("category_id, submitter_email")
    .like("submitter_email", `%+${runId}@${emailDomain}`)

  if (nominationCountError) {
    throw nominationCountError
  }

  const countsByCategory = new Map()
  for (const row of nominationCounts || []) {
    countsByCategory.set(row.category_id, (countsByCategory.get(row.category_id) || 0) + 1)
  }

  const underNominated = nominationCategories.filter((category) => (countsByCategory.get(category.id) || 0) < nominationsPerCategory)

  if (underNominated.length) {
    throw new Error(`Categories below nomination threshold: ${underNominated.map((category) => category.id).join(", ")}`)
  }

  const { data: voteRows, error: voteCountError } = await supabase
    .from("votes")
    .select("category_id, nominee_name, voter_email, award_year")
    .eq("award_year", awardYear)
    .like("voter_email", `%+${runId}@${emailDomain}`)

  if (voteCountError) {
    throw voteCountError
  }

  const duplicateVoteKeys = new Set()
  const seenVoteKeys = new Set()

  for (const vote of voteRows || []) {
    const key = `${vote.category_id}:${vote.voter_email}:${vote.award_year}`

    if (seenVoteKeys.has(key)) {
      duplicateVoteKeys.add(key)
    }

    seenVoteKeys.add(key)
  }

  if (duplicateVoteKeys.size) {
    throw new Error(`Duplicate stored votes found: ${Array.from(duplicateVoteKeys).join(", ")}`)
  }

  const cheatStoredVotes = (voteRows || []).filter((vote) => vote.voter_email === cheatEmail && vote.category_id === cheatCategory.id)

  if (cheatStoredVotes.length !== 1) {
    throw new Error(`Expected exactly one stored cheat vote, found ${cheatStoredVotes.length}`)
  }

  const summary = {
    runId,
    baseUrl,
    awardYear,
    liveCategories: liveCategories.length,
    streamingCategories: streamingCategories.length,
    nominationsPerCategory,
    nominationsSubmitted: nominationResults.length,
    finalistsInserted: finalistRows.length,
    ballotsSubmitted: ballotVoters.length,
    voteRowsStored: voteRows?.length || 0,
    duplicateAttemptStatus: blockedCheat.response.status,
    keepActionSkippedDuplicates: keepCheat.body.skippedDuplicates,
    overwriteAttemptStatus: overwriteCheat.response.status,
    overwriteAllowed: false,
    oneStoredVoteForCheatCategory: cheatStoredVotes.length === 1,
    cleanup: shouldCleanup,
  }

  if (shouldCleanup) {
    await cleanupRun()
  }

  console.log(JSON.stringify(summary, null, 2))
}

main().catch(async (error) => {
  if (shouldCleanup) {
    await cleanupRun().catch(() => {})
  }

  console.error(error)
  process.exit(1)
})
