import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../../lib/company.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: "Method not allowed" })

  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required" })

  const { data, error } = await supabaseAdmin
    .from('investment_holdings')
    .select('*, fractional_investments(property_id, properties(title, location, images))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ holdings: data || [] })
}
