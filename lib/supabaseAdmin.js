import { createClient } from "@supabase/supabase-js"

/**
 * Centralized Supabase admin client (service role).
 * Uses environment variables — NO hardcoded keys.
 * All API routes should import from here instead of creating their own client.
 *
 * Required env vars:
 *   SUPABASE_URL — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — your service role key (from Dashboard → Settings → API)
 */
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emldbjqegftrngxypeca.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.warn(
    "[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY is not set. " +
    "Server-side Supabase calls will fail. " +
    "Set it in your .env.local and Vercel environment variables."
  )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || "missing-service-key")

// Also export the raw values for pages that need direct REST calls
export const SUPA_URL = supabaseUrl
export const SUPA_KEY = supabaseServiceKey || "missing-service-key"
