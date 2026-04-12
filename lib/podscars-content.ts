import "server-only"

import {
  defaultPodscarsCategories,
  defaultSampleFinalists,
  type PodscarsCategory,
  type PodscarsFinalistGroup,
} from "@/lib/podscars-data"
import { mapSupabaseCategories, mapSupabaseFinalists } from "@/lib/podscars-live"
import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  type SupabaseCategoryRow,
  type SupabaseFinalistRow,
} from "@/lib/supabase"

type PodscarsContent = {
  categories: PodscarsCategory[]
  finalists: PodscarsFinalistGroup[]
  source: "fallback" | "supabase"
}

export async function getPodscarsContent(): Promise<PodscarsContent> {
  if (!isSupabaseConfigured()) {
    return {
      categories: defaultPodscarsCategories,
      finalists: defaultSampleFinalists,
      source: "fallback",
    }
  }

  try {
    const supabase = getSupabaseAdminClient()
    const [{ data: categoryRows, error: categoryError }, { data: finalistRows, error: finalistError }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("finalists").select("*").order("sort_order", { ascending: true }),
    ])

    if (categoryError) {
      throw categoryError
    }

    if (finalistError) {
      throw finalistError
    }

    const categories = mapSupabaseCategories((categoryRows || []) as SupabaseCategoryRow[])

    if (!categories.length) {
      return {
        categories: defaultPodscarsCategories,
        finalists: defaultSampleFinalists,
        source: "fallback",
      }
    }

    const finalists = mapSupabaseFinalists((finalistRows || []) as SupabaseFinalistRow[], categories)

    return {
      categories,
      finalists,
      source: "supabase",
    }
  } catch (error) {
    console.error("Falling back to local Podscars content because Supabase fetch failed.", error)

    return {
      categories: defaultPodscarsCategories,
      finalists: defaultSampleFinalists,
      source: "fallback",
    }
  }
}
