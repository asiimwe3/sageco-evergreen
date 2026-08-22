import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { investment_id, investor_email, investor_name, investor_phone, shares_requested } = req.body
  if (!investment_id || !investor_email || !shares_requested) return res.status(400).json({ error: "investment_id, investor_email, shares_requested required" })

  const { data: inv } = await supabaseAdmin.from('fractional_investments').select('*').eq('id', investment_id).single()
  if (!inv) return res.status(404).json({ error: "Investment not found" })
  if (inv.status !== 'active') return res.status(400).json({ error: "Investment not active" })
  if (shares_requested < inv.min_shares) return res.status(400).json({ error: `Minimum ${inv.min_shares} shares required` })
  if (shares_requested > inv.shares_available) return res.status(400).json({ error: `Only ${inv.shares_available} shares available` })

  const amount = shares_requested * Number(inv.price_per_share)
  const { data: holding, error: hErr } = await supabaseAdmin
    .from('investment_holdings')
    .insert([{
      fractional_investment_id: investment_id, investor_email, investor_name, investor_phone,
      shares_owned: shares_requested, amount_invested: amount, status: 'active'
    }])
    .select()
    .single()

  if (hErr) return res.status(500).json({ error: hErr.message })

  const newAvailable = inv.shares_available - shares_requested
  const newStatus = newAvailable === 0 ? 'sold_out' : 'active'
  await supabaseAdmin.from('fractional_investments')
    .update({ shares_available: newAvailable, status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', investment_id)

  res.status(200).json({ success: true, holding, total_cost: amount, shares_remaining: newAvailable })
}
