import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { property_id, total_shares, price_per_share, min_shares, roi_projection } = req.body
  if (!property_id || !total_shares || !price_per_share) return res.status(400).json({ error: "property_id, total_shares, price_per_share required" })

  const { data, error } = await supabaseAdmin
    .from('fractional_investments')
    .insert([{
      property_id, total_shares, shares_available: total_shares,
      price_per_share, min_shares: min_shares || 1,
      roi_projection: roi_projection || null, currency: 'UGX', status: 'active'
    }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('properties').update({ is_tokenized: true }).eq('id', property_id)
  res.status(200).json({ success: true, investment: data })
}
