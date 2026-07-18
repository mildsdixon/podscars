import "server-only"

import { createHash, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { DEFAULT_ADMIN_SETTINGS, getSupabaseAdminClient, isSupabaseConfigured, type SupabaseAdminSettingsRow } from "@/lib/supabase"
import { requireSupabaseAdmin } from "@/lib/podscars-auth"

const ADMIN_COOKIE_NAME = "podscars_admin_session"

function getAdminPassword() {
  return process.env.PODSCARS_ADMIN_PASSWORD || ""
}

function getSessionValue(password: string) {
  return createHash("sha256").update(`podscars-admin:${password}`).digest("hex")
}

export type AdminSettings = {
  nominationsOpen: boolean
  votingOpen: boolean
  nominationsMessage: string
  votingMessage: string
  homepageFlowEyebrow: string
  homepageFlowTitle: string
  homepageFlowSummary: string
  heroBannerImageUrl: string
  heroBannerAltText: string
}

export function isAdminConfigured() {
  return isSupabaseConfigured() || Boolean(getAdminPassword())
}

export async function isAdminAuthenticated() {
  if (isSupabaseConfigured()) {
    return requireSupabaseAdmin()
  }

  const password = getAdminPassword()

  if (!password) {
    return false
  }

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!sessionCookie) {
    return false
  }

  const expectedValue = getSessionValue(password)
  const provided = Buffer.from(sessionCookie)
  const expected = Buffer.from(expectedValue)

  if (provided.length !== expected.length) {
    return false
  }

  return timingSafeEqual(provided, expected)
}

export async function createAdminSession() {
  const password = getAdminPassword()

  if (!password) {
    throw new Error("Admin password is not configured.")
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, getSessionValue(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function requireAdmin() {
  return isAdminAuthenticated()
}

function mapAdminSettings(row: SupabaseAdminSettingsRow): AdminSettings {
  return {
    nominationsOpen: row.nominations_open,
    votingOpen: row.voting_open,
    nominationsMessage: row.nominations_message,
    votingMessage: row.voting_message,
    homepageFlowEyebrow: row.homepage_flow_eyebrow || DEFAULT_ADMIN_SETTINGS.homepage_flow_eyebrow,
    homepageFlowTitle: row.homepage_flow_title || DEFAULT_ADMIN_SETTINGS.homepage_flow_title,
    homepageFlowSummary: row.homepage_flow_summary || DEFAULT_ADMIN_SETTINGS.homepage_flow_summary,
    heroBannerImageUrl: row.hero_banner_image_url || DEFAULT_ADMIN_SETTINGS.hero_banner_image_url,
    heroBannerAltText: row.hero_banner_alt_text || DEFAULT_ADMIN_SETTINGS.hero_banner_alt_text,
  }
}

export async function getAdminSettings(): Promise<AdminSettings> {
  if (!isSupabaseConfigured()) {
    return mapAdminSettings(DEFAULT_ADMIN_SETTINGS)
  }

  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase.from("admin_settings").select("*").eq("id", 1).maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      const { data: created, error: insertError } = await supabase
        .from("admin_settings")
        .upsert(DEFAULT_ADMIN_SETTINGS, { onConflict: "id" })
        .select("*")
        .single()

      if (insertError) {
        throw insertError
      }

      return mapAdminSettings(created as SupabaseAdminSettingsRow)
    }

    return mapAdminSettings(data as SupabaseAdminSettingsRow)
  } catch (error) {
    console.error("Falling back to default admin settings because Supabase settings queries failed.", error)
    return mapAdminSettings(DEFAULT_ADMIN_SETTINGS)
  }
}

export async function updateAdminSettings(settings: AdminSettings): Promise<AdminSettings> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.")
  }

  const supabase = getSupabaseAdminClient()
  const payload = {
    id: 1,
    nominations_open: settings.nominationsOpen,
    voting_open: settings.votingOpen,
    nominations_message: settings.nominationsMessage,
    voting_message: settings.votingMessage,
    homepage_flow_eyebrow: settings.homepageFlowEyebrow,
    homepage_flow_title: settings.homepageFlowTitle,
    homepage_flow_summary: settings.homepageFlowSummary,
    hero_banner_image_url: settings.heroBannerImageUrl,
    hero_banner_alt_text: settings.heroBannerAltText,
  }

  const { data, error } = await supabase.from("admin_settings").upsert(payload, { onConflict: "id" }).select("*").single()

  if (error) {
    throw error
  }

  return mapAdminSettings(data as SupabaseAdminSettingsRow)
}
