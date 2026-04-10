import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

/**
 * Get the Supabase client. Returns null if not configured.
 */
export function getSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) return null

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key)
  }

  return supabaseInstance
}

/**
 * Check if Supabase is configured and device is online.
 */
export function isSupabaseAvailable(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
    navigator.onLine
}
