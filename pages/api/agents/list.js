// List all active agents
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { status } = req.query

  try {
    let query = supabaseAdmin
      .from('agents')
      .select('id, full_name, phone, email, location, level, group_name, registration_status, downline_count, total_earnings, created_at')
      .order('created_at', { ascending: false })
      .limit(50)

    if (status) query = query.eq('registration_status', status)

    const { data, error } = await query

    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ agents: data || [], total: (data || []).length })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
