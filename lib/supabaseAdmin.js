import { createClient } from "@supabase/supabase-js"

/**
 * Centralized Supabase admin client (service role).
 * Uses environment variables with hardcoded fallbacks for the existing deployment.
 * All API routes should import from here instead of creating their own client.
 */
const supabaseUrl = process.env.SUPABASE_URL || "https://emldbjqegftrngxypeca.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk"

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Also export the raw values for pages that need direct REST calls
export const SUPA_URL = supabaseUrl
export const SUPA_KEY = supabaseServiceKey
