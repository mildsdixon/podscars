"use client"

import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseBrowserPublishableKey, getSupabaseBrowserUrl } from "@/lib/supabase-public"

export function createSupabaseBrowserClient() {
  return createBrowserClient(getSupabaseBrowserUrl(), getSupabaseBrowserPublishableKey())
}
