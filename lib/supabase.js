import { createClient } from "@supabase/supabase-js"

/**
 * Client-side Supabase client (anon key).
 * Used in browser components and pages.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emldbjqegftrngxypeca.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTQyNzMsImV4cCI6MjA5NTY3MDI3M30.e2KGeOLpJ41NyNjgI_EY8ZZYgG5pTTxnhLRNnHPmKRs"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
