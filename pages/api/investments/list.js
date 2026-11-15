import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

// Attach related property rows without relying on a PostgREST foreign-key embed
// (the FK is not declared in the database, which made the old embed return 500).
async function attachProperties(supabaseAdmin, rows, fk = "property_id", fields = "title, location, price, category, images, land_acres") {
  if (!Array.isArray(rows) || rows.length === 0) return rows
  const ids = [...new Set(rows.map(r => r[fk]).filter(Boolean))]
  if (ids.length === 0) return rows
  const { data } = await supabaseAdmin.from("properties").select("id, " + fields).in("id", ids)
  const map = new Map((data || []).map(p => [p.id, p]))
  return rows.map(r => ({ ...r, properties: map.get(r[fk]) || null }))
}

export default async function handler(req, res) {
  const { active_only } = req.query
  let query = supabaseAdmin.from("fractional_investments").select("*").order("created_at", { ascending: false })
  if (active_only === "true") query = query.eq("status", "active")
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  const investments = await attachProperties(supabaseAdmin, data || [])
  res.status(200).json({ investments })
}
