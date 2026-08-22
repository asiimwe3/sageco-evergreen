import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.ADMIN_SECRET || ""

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).json({ error: "Forbidden" })

  const { property_id, severity } = req.query
  let query = supabaseAdmin.from('fraud_flags').select('*, properties(title, location)').order('created_at', { ascending: false })
  if (property_id) query = query.eq('property_id', property_id)
  if (severity) query = query.eq('severity', severity)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  res.status(200).json({ flags: data || [] })
}
