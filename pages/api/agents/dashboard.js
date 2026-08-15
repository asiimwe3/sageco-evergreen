// MLM Agent Dashboard — get agent stats, downline, commissions, group
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { agent_id } = req.query
  if (!agent_id) return res.status(400).json({ error: 'Agent ID is required' })

  try {
    // Get agent profile
    const { data: agent } = await supabaseAdmin
      .from('agents').select('*').eq('id', agent_id).limit(1)

    if (!agent || agent.length === 0) return res.status(404).json({ error: 'Agent not found' })

    // Get downline (direct + indirect)
    const { data: directDownline } = await supabaseAdmin
      .from('agent_downline')
      .select('downline_agent_id, level, status, created_at')
      .eq('agent_id', agent_id)
      .order('created_at', { ascending: false })

    // Get downline agent details
    let downlineDetails = []
    if (directDownline && directDownline.length > 0) {
      const downlineIds = directDownline.map(d => d.downline_agent_id)
      const { data: dlAgents } = await supabaseAdmin
        .from('agents')
        .select('id, full_name, phone, location, registration_status, level, downline_count, created_at')
        .in('id', downlineIds)
        .order('created_at', { ascending: false })
      downlineDetails = dlAgents || []
    }

    // Get commissions
    const { data: commissions } = await supabaseAdmin
      .from('agent_commissions')
      .select('*')
      .eq('agent_id', agent_id)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get group info
    let group = null
    if (agent[0].group_id) {
      const { data: groupData } = await supabaseAdmin
        .from('agent_groups').select('*').eq('id', agent[0].group_id).limit(1)
      group = groupData && groupData.length > 0 ? groupData[0] : null
    }

    // Get sponsor info
    let sponsor = null
    if (agent[0].sponsor_id) {
      const { data: sData } = await supabaseAdmin
        .from('agents').select('id, full_name, phone, level').eq('id', agent[0].sponsor_id).limit(1)
      sponsor = sData && sData.length > 0 ? sData[0] : null
    }

    // Calculate totals
    const totalCommissions = (commissions || []).reduce((sum, c) => sum + Number(c.amount), 0)
    const pendingCommissions = (commissions || []).filter(c => c.status === 'pending').reduce((sum, c) => sum + Number(c.amount), 0)
    const paidCommissions = (commissions || []).filter(c => c.status === 'paid').reduce((sum, c) => sum + Number(c.amount), 0)
    const directCount = (directDownline || []).filter(d => d.level === 1).length

    return res.status(200).json({
      agent: agent[0],
      sponsor,
      group,
      downline: downlineDetails,
      downline_count: directCount,
      total_downline: (directDownline || []).length,
      commissions: commissions || [],
      stats: {
        total_commissions: totalCommissions,
        pending_commissions: pendingCommissions,
        paid_commissions: paidCommissions,
        direct_downline: directCount,
        level: agent[0].level || 1,
      }
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
