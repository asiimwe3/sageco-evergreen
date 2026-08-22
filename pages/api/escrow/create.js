import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { property_id, buyer_email, buyer_phone, seller_email, amount, milestones, escrow_type } = req.body
  if (!property_id || !buyer_email || !amount) return res.status(400).json({ error: "property_id, buyer_email, amount required" })

  const formattedMilestones = (milestones || []).map(m => ({
    name: m.name || 'Milestone', amount: m.amount || 0, status: 'pending', completed_at: null
  }))

  const { data, error } = await supabaseAdmin
    .from('escrow_transactions')
    .insert([{
      property_id, buyer_email, buyer_phone, seller_email: seller_email || null,
      amount, currency: 'UGX', milestones: formattedMilestones,
      status: 'pending', escrow_type: escrow_type || 'purchase', gps_verified: false
    }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ success: true, escrow: data })
}
