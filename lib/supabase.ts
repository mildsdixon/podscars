import "server-only"

import { createClient } from "@supabase/supabase-js"

export type SupabaseCategoryRow = {
  id: string
  title: string
  type: "person" | "podcast" | "movie"
  description: string | null
  nomination_prompt: string | null
  active: boolean | null
  sort_order: number | null
}

export type SupabaseFinalistRow = {
  id: string
  category_id: string
  name: string
  subtitle: string | null
  active: boolean | null
  sort_order: number | null
}

export type SupabaseNominationRow = {
  id: string
  category_id: string
  category_title: string
  nominee_name: string
  project_title: string
  reference_link: string | null
  reason: string
  submitted_by: string
  submitter_email: string
  user_id: string | null
  status: string
  submitted_at: string
}

export type SupabaseVoteRow = {
  id: string
  category_id: string
  category_title: string
  nominee_name: string
  voter_name: string
  voter_email: string
  award_year: number
  user_id: string | null
  submitted_at: string
}

export type SupabaseAdminSettingsRow = {
  id: number
  nominations_open: boolean
  voting_open: boolean
  nominations_message: string
  voting_message: string
  homepage_flow_eyebrow: string
  homepage_flow_title: string
  homepage_flow_summary: string
}

export type SupabaseAdSpotRow = {
  id: number
  slot: number
  image_url: string
  alt_text: string | null
  active: boolean | null
  updated_at: string
}

export type SupabaseProfileRow = {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getSupabaseUrl() {
  return getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
}

export function getSupabasePublishableKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  )
}

export function getSupabaseAdminClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  return createClient(getSupabaseUrl(), key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

export const DEFAULT_ADMIN_SETTINGS: SupabaseAdminSettingsRow = {
  id: 1,
  nominations_open: true,
  voting_open: true,
  nominations_message: "Nominations are temporarily closed. Please check back soon.",
  voting_message: "Voting is temporarily closed. Please check back soon.",
  homepage_flow_eyebrow: "How It Works",
  homepage_flow_title: "Simple flow",
  homepage_flow_summary: "Nominate, shortlist, vote, announce.",
}
