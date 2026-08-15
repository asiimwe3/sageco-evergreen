import { createClient } from "@supabase/supabase-js"
const supabase = createClient("https://eiyexnuhqdscomilwpqg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc")
const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).json({ error: "Forbidden" })

  const { id, ...updates } = req.body
  if (!id) return res.status(400).json({ error: "Missing id" })

  const allowed = ["status", "featured", "title", "description", "price", "location", "category",
    "sub_type", "bedrooms", "bathrooms", "area_sqft", "floor_level", "land_acres", "plot_feet",
    "water_available", "electricity_available", "road_distance_km", "fence", "title_deed",
    "is_negotiable", "contact_name", "contact_phone", "images", "broker_id"]
  const safe = {}
  for (const k of allowed) { if (k in updates) safe[k] = updates[k] }
  safe.updated_at = new Date().toISOString()

  const { error } = await supabase.from("properties").update(safe).eq("id", id)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
