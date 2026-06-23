import "server-only"

import { getSupabaseAdminClient, isSupabaseConfigured, type SupabaseAdSpotRow } from "@/lib/supabase"

export type AdSpot = {
  id: number
  slot: number
  imageUrl: string
  altText: string
  active: boolean
}

export const DEFAULT_AD_IMAGE = "/podscars-social-mockups/podscars-landscape-ad-1200x628.png"

export const defaultAdSpots: AdSpot[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  slot: index + 1,
  imageUrl: DEFAULT_AD_IMAGE,
  altText: `Podscars advertising spot ${index + 1}`,
  active: true,
}))

function mapAdSpot(row: SupabaseAdSpotRow): AdSpot {
  return {
    id: row.id,
    slot: row.slot,
    imageUrl: row.image_url,
    altText: row.alt_text || `Podscars advertising spot ${row.slot}`,
    active: row.active !== false,
  }
}

export async function getAdSpots(): Promise<AdSpot[]> {
  if (!isSupabaseConfigured()) {
    return defaultAdSpots
  }

  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase.from("ad_spots").select("*").order("slot", { ascending: true })

    if (error) {
      throw error
    }

    const spots = (data || []).map((row) => mapAdSpot(row as SupabaseAdSpotRow))

    return spots.length ? spots : defaultAdSpots
  } catch (error) {
    console.error("Falling back to default ad spots because Supabase ad spot fetch failed.", error)
    return defaultAdSpots
  }
}

export async function updateAdSpots(spots: AdSpot[]) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.")
  }

  const supabase = getSupabaseAdminClient()
  const payload = spots.map((spot, index) => ({
    id: spot.id || index + 1,
    slot: index + 1,
    image_url: spot.imageUrl,
    alt_text: spot.altText,
    active: spot.active,
    updated_at: new Date().toISOString(),
  }))

  const { data, error } = await supabase
    .from("ad_spots")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .order("slot", { ascending: true })

  if (error) {
    throw error
  }

  return (data || []).map((row) => mapAdSpot(row as SupabaseAdSpotRow))
}
