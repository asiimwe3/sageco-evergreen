import { createClient } from "@supabase/supabase-js"

/**
 * Centralized Supabase admin client (service role).
 *
 * Required env vars:
 *   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) — must be a real URL starting with https://
 *   SUPABASE_SERVICE_ROLE_KEY — service role key from Supabase Dashboard → Settings → API
 */
const PROJECT_URL = "https://emldbjqegftrngxypeca.supabase.co"

function validUrl(u) {
  return typeof u === "string" && /^https?:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(u.trim())
}

const rawUrl = process.env.SUPABASE_URL
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseUrl = validUrl(rawUrl)
  ? rawUrl.trim().replace(/\/$/, "")
  : validUrl(publicUrl)
    ? publicUrl.trim().replace(/\/$/, "")
    : PROJECT_URL

if (rawUrl && !validUrl(rawUrl)) {
  console.error("[supabaseAdmin] SUPABASE_URL is not a valid Supabase URL — falling back to NEXT_PUBLIC_SUPABASE_URL / default project.")
}

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error("[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY is not set. Server-side Supabase calls will fail.")
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || "missing-service-key", {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Raw values for pages that need direct REST calls
export const SUPA_URL = supabaseUrl
export const SUPA_KEY = supabaseServiceKey || "missing-service-key"
export const SUPA_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

/**
 * Resilient REST read for PUBLIC data (properties, brokers, etc).
 * Tries the service-role key first, then the public anon key (RLS permitting).
 * Returns { data, error } — error is set only when BOTH attempts fail.
 */
export async function publicRead(path) {
  const attempts = [
    { key: SUPA_KEY, label: "service-role" },
    SUPA_ANON_KEY ? { key: SUPA_ANON_KEY, label: "anon" } : null,
  ].filter(Boolean)

  let lastErr = null
  for (const a of attempts) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
        headers: { apikey: a.key, Authorization: `Bearer ${a.key}` },
        cache: "no-store",
      })
      const body = await res.json().catch(() => null)
      if (res.ok && Array.isArray(body)) return { data: body, error: null, via: a.label }
      lastErr = `${a.label}: HTTP ${res.status} ${body ? JSON.stringify(body).slice(0, 200) : ""}`
      console.error("[publicRead]", lastErr)
    } catch (e) {
      lastErr = `${a.label}: ${String(e).slice(0, 200)}`
      console.error("[publicRead]", lastErr)
    }
  }
  return { data: null, error: lastErr || "unknown error", via: null }
}

/**
 * Resilient count query for public data.
 */
export async function publicCount(path, headers = {}) {
  const attempts = [
    SUPA_KEY,
    SUPA_ANON_KEY || null,
  ].filter(Boolean)

  for (const key of attempts) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact", ...headers },
        cache: "no-store",
      })
      const range = res.headers.get("content-range")
      if (res.ok && range) return { count: parseInt(range.split("/")[1], 10) || 0, error: null }
    } catch (e) {
      console.error("[publicCount]", String(e).slice(0, 200))
    }
  }
  return { count: 0, error: "count failed" }
}
