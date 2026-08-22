import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { investor_email } = req.query
  if (!investor_email) return res.status(400).json({ error: "investor_email required" })

  const { data, error } = await supabaseAdmin
    .from('investment_holdings')
    .select('*, fractional_investments(*, properties(title, location, images))')
    .eq('investor_email', investor_email)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ holdings: data || [] })
}
