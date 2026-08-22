import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { property_id } = req.query
  if (!property_id) return res.status(400).json({ error: "property_id required" })

  const { data, error } = await supabaseAdmin.from('property_valuations').select('*').eq('property_id', property_id).single()
  if (error) return res.status(404).json({ error: "No valuation found" })
  res.status(200).json({ valuation: data })
}
