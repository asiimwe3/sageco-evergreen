import { createClient } from "@supabase/supabase-js"

/**
 * Client-side Supabase client (anon key).
 * Used in browser components and pages.
 *
 * IMPORTANT: The anon key must match the project URL.
 * Project: emldbjqegftrngxypeca
 * Get the correct anon key from: Supabase Dashboard → Settings → API
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emldbjqegftrngxypeca.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. " +
    "Client-side Supabase calls (auth, data fetching) will fail. " +
    "Set it in your .env.local and Vercel environment variables."
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "missing-anon-key")
