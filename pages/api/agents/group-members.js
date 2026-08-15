// Get group members for an agent's group
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { group_id } = req.query
  if (!group_id) return res.status(400).json({ error: 'Group ID is required' })

  try {
    const { data: members } = await supabaseAdmin
      .from('brokers')
      .select('id, full_name, phone, email, location, specialization, plan, registration_status, mlm_level, created_at')
      .eq('group_id', group_id)
      .order('created_at', { ascending: false })

    const { data: group } = await supabaseAdmin
      .from('agent_groups').select('*').eq('id', group_id).limit(1)

    return res.status(200).json({
      group: group && group.length > 0 ? group[0] : null,
      members: members || [],
      member_count: (members || []).length
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
