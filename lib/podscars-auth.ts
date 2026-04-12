import "server-only"

import { getSupabaseAuthState } from "@/lib/supabase-server"
import { isSupabaseConfigured } from "@/lib/supabase"

export async function getPodscarsAuthContext() {
  if (!isSupabaseConfigured()) {
    return {
      mode: "password" as const,
      user: null,
      profile: null,
    }
  }

  const { user, profile } = await getSupabaseAuthState()

  return {
    mode: "supabase" as const,
    user,
    profile,
  }
}

export async function requireSupabaseAdmin() {
  const { mode, user, profile } = await getPodscarsAuthContext()

  if (mode !== "supabase") {
    return false
  }

  return Boolean(user && profile?.is_admin)
}
