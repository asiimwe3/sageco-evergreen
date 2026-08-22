import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { escrow_id, gps_coordinates } = req.body
  if (!escrow_id || !gps_coordinates) return res.status(400).json({ error: "escrow_id and gps_coordinates required" })

  const { data, error } = await supabaseAdmin
    .from('escrow_transactions')
    .update({ gps_verified: true, updated_at: new Date().toISOString() })
    .eq('id', escrow_id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ success: true, escrow: data })
}
