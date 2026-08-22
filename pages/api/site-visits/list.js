import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { property_id, visitor_email } = req.query
  let query = supabaseAdmin.from('site_visits').select('*, properties(title, location)').order('created_at', { ascending: false })
  if (property_id) query = query.eq('property_id', property_id)
  if (visitor_email) query = query.eq('visitor_email', visitor_email)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ visits: data || [] })
}
