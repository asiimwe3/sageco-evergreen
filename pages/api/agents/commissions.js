// Get agent commissions
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { agent_id, status } = req.query
  if (!agent_id) return res.status(400).json({ error: 'Agent ID is required' })

  try {
    let query = supabaseAdmin
      .from('agent_commissions')
      .select('*')
      .eq('agent_id', agent_id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })

    const total = (data || []).reduce((s, c) => s + Number(c.amount), 0)
    const pending = (data || []).filter(c => c.status === 'pending').reduce((s, c) => s + Number(c.amount), 0)
    const paid = (data || []).filter(c => c.status === 'paid').reduce((s, c) => s + Number(c.amount), 0)

    return res.status(200).json({
      commissions: data || [],
      total, pending, paid,
      count: (data || []).length
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
