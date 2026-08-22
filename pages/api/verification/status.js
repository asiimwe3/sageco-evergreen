import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { property_id } = req.query
  if (!property_id) return res.status(400).json({ error: "property_id required" })

  const { data, error } = await supabaseAdmin
    .from('property_verifications')
    .select('*')
    .eq('property_id', property_id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  const latest = data?.[0]
  res.status(200).json({ status: latest?.verification_status || 'unverified', records: data || [] })
}
