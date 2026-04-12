"use client"

import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseBrowserPublishableKey, getSupabaseBrowserUrl } from "@/lib/supabase-public"

export const createClient = () =>
  createBrowserClient(getSupabaseBrowserUrl(), getSupabaseBrowserPublishableKey())
