// MLM Agent Dashboard — get agent stats, downline, commissions, group, wallet
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { agent_id } = req.query
  if (!agent_id) return res.status(400).json({ error: 'Agent ID is required' })

  try {
    const { data: agent } = await supabaseAdmin
      .from('agents').select('*').eq('id', agent_id).limit(1)
    if (!agent || agent.length === 0) return res.status(404).json({ error: 'Agent not found' })

    const { data: directDownline } = await supabaseAdmin
      .from('agent_downline')
      .select('downline_agent_id, level, status, created_at')
      .eq('agent_id', agent_id)
      .order('created_at', { ascending: false })

    let downlineDetails = []
    if (directDownline && directDownline.length > 0) {
      const downlineIds = directDownline.map(d => d.downline_agent_id)
      const { data: dlAgents } = await supabaseAdmin
        .from('agents')
        .select('id, full_name, phone, location, registration_status, level, downline_count')
        .in('id', downlineIds)
      downlineDetails = dlAgents || []
    }

    const { data: commissions } = await supabaseAdmin
      .from('agent_commissions')
      .select('*')
      .eq('agent_id', agent_id)
      .order('created_at', { ascending: false })
      .limit(20)

    let group = null
    if (agent[0].group_id) {
      const { data: groupData } = await supabaseAdmin
        .from('agent_groups').select('*').eq('id', agent[0].group_id).limit(1)
      group = groupData && groupData[0]
    }

    let sponsor = null
    if (agent[0].sponsor_id) {
      const { data: sponsorData } = await supabaseAdmin
        .from('agents').select('id, full_name, phone, level').eq('id', agent[0].sponsor_id).limit(1)
      sponsor = sponsorData && sponsorData[0]
    }

    // Calculate stats
    const totalEarnings = parseFloat(agent[0].total_earnings) || 0
    const totalWithdrawn = parseFloat(agent[0].total_withdrawn) || 0
    const pendingWithdrawal = parseFloat(agent[0].pending_withdrawal) || 0
    const availableBalance = totalEarnings - totalWithdrawn - pendingWithdrawal

    const pendingCommissions = (commissions || []).filter(c => c.status === 'pending').reduce((s, c) => s + parseFloat(c.amount), 0)
    const paidCommissions = (commissions || []).filter(c => c.status === 'paid').reduce((s, c) => s + parseFloat(c.amount), 0)

    const stats = {
      direct_downline: downlineDetails.filter(d => d.registration_status === 'active' || d.registration_status === 'pending').length,
      total_downline: directDownline ? directDownline.length : 0,
      pending_commissions: pendingCommissions,
      paid_commissions: paidCommissions,
      total_earnings: totalEarnings,
      available_balance: availableBalance,
      total_withdrawn: totalWithdrawn,
      pending_withdrawal: pendingWithdrawal
    }

    return res.status(200).json({
      agent: agent[0],
      sponsor,
      group,
      downline: downlineDetails,
      commissions: commissions || [],
      stats
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    return res.status(500).json({ error: err.message })
  }
}
