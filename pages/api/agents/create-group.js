// MLM Agent — Create a Group
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { agent_id, name, description, is_public } = req.body
  if (!agent_id || !name) return res.status(400).json({ error: 'Agent ID and group name are required' })

  try {
    const { data: agent } = await supabaseAdmin
      .from('agents').select('id, registration_status, group_id').eq('id', agent_id).limit(1)

    if (!agent || agent.length === 0) return res.status(404).json({ error: 'Agent not found' })
    if (agent[0].registration_status !== 'active') return res.status(403).json({ error: 'Agent account is not active' })
    if (agent[0].group_id) return res.status(409).json({ error: 'Agent already owns a group' })

    const { data: group, error } = await supabaseAdmin
      .from('agent_groups').insert([{
        owner_agent_id: agent_id, name, description: description || null,
        is_public: is_public !== false, member_count: 1, active_members: 1,
      }]).select()

    if (error) return res.status(500).json({ error: error.message })

    await supabaseAdmin.from('agents')
      .update({ group_id: group[0].id, group_name: name, updated_at: new Date().toISOString() })
      .eq('id', agent_id)

    return res.status(201).json({ success: true, group: group[0], message: 'Group "' + name + '" created!' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
