import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../../lib/company.js'

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
  if (req.method !== 'GET') return res.status(405).json({ error: "Method not allowed" })

  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required" })

  const { data, error } = await supabaseAdmin
    .from('escrow_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  const transactions = await attachProperties(supabaseAdmin, data || [], 'property_id', 'title, location, price, images')
  res.status(200).json({ transactions })
}
