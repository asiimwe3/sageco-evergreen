import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { active_only } = req.query
  let query = supabaseAdmin.from('fractional_investments')
    .select('*, properties(title, location, price, category, images, area_sqft, land_acres)')
    .order('created_at', { ascending: false })
  if (active_only === 'true') query = query.eq('status', 'active')

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ investments: data || [] })
}
