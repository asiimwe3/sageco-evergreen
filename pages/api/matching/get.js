import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { user_email } = req.query
  if (!user_email) return res.status(400).json({ error: "user_email required" })

  const { data, error } = await supabaseAdmin
    .from('property_matches')
    .select('*')
    .eq('user_email', user_email)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ matches: data || [] })
}
