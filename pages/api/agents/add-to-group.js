// MLM Agent — Add a broker to their group
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { agent_id, broker_id } = req.body
  if (!agent_id || !broker_id) return res.status(400).json({ error: 'Agent ID and broker ID are required' })

  try {
    const { data: agent } = await supabaseAdmin
      .from('agents').select('id, group_id, registration_status').eq('id', agent_id).limit(1)

    if (!agent || agent.length === 0) return res.status(404).json({ error: 'Agent not found' })
    if (agent[0].registration_status !== 'active') return res.status(403).json({ error: 'Agent not active' })
    if (!agent[0].group_id) return res.status(400).json({ error: 'Agent has no group. Create a group first.' })

    const { data: broker } = await supabaseAdmin
      .from('brokers').select('id, full_name, group_id').eq('id', broker_id).limit(1)

    if (!broker || broker.length === 0) return res.status(404).json({ error: 'Broker not found' })
    if (broker[0].group_id) return res.status(409).json({ error: 'Broker already belongs to a group' })

    await supabaseAdmin.from('brokers')
      .update({ group_id: agent[0].group_id, sponsor_agent_id: agent_id, mlm_level: 1 })
      .eq('id', broker_id)

    const { data: group } = await supabaseAdmin
      .from('agent_groups').select('member_count').eq('id', agent[0].group_id).limit(1)

    if (group && group.length > 0) {
      await supabaseAdmin.from('agent_groups')
        .update({ member_count: (group[0].member_count || 1) + 1, updated_at: new Date().toISOString() })
        .eq('id', agent[0].group_id)
    }

    return res.status(200).json({ success: true, message: 'Broker added to group' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
