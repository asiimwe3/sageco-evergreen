import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../../lib/company.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  // Require auth
  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required" })

  const { investment_id, investor_email, investor_name, investor_phone, shares_requested } = req.body
  if (!investment_id || !investor_email || !shares_requested) return res.status(400).json({ error: "investment_id, investor_email, shares_requested required" })

  const { data: inv } = await supabaseAdmin.from('fractional_investments').select('*').eq('id', investment_id).single()
  if (!inv) return res.status(404).json({ error: "Investment not found" })
  if (inv.status !== 'active') return res.status(400).json({ error: "Investment not active" })
  if (shares_requested < inv.min_shares) return res.status(400).json({ error: `Minimum ${inv.min_shares} shares required` })
  if (shares_requested > inv.shares_available) return res.status(400).json({ error: `Only ${inv.shares_available} shares available` })

  const amount = shares_requested * Number(inv.price_per_share)

  const { data, error } = await supabaseAdmin.from('investment_holdings').insert([{
    investment_id, investor_email, investor_name, investor_phone,
    shares_owned: shares_requested, amount_paid: amount, currency: 'UGX',
    status: 'pending_payment', user_id: user.id
  }]).select().single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('fractional_investments')
    .update({ shares_available: inv.shares_available - shares_requested })
    .eq('id', investment_id)

  res.status(201).json({ holding: data, amount_due: amount })
}
