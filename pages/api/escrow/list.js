import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { property_id, buyer_email } = req.query
  let query = supabaseAdmin.from('escrow_transactions').select('*').order('created_at', { ascending: false })
  if (property_id) query = query.eq('property_id', property_id)
  if (buyer_email) query = query.eq('buyer_email', buyer_email)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ escrows: data || [] })
}
