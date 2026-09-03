// Admin Withdrawal Management — approve/reject withdrawals, list all
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // ── GET: List all withdrawals (with agent info) ──
    if (req.method === 'GET') {
      const { status, agent_id } = req.query
      let query = supabaseAdmin
        .from('agent_withdrawals')
        .select('*')
        .order('created_at', { ascending: false })

      if (status) query = query.eq('status', status)
      if (agent_id) query = query.eq('agent_id', agent_id)

      const { data: withdrawals, error } = await query
      if (error) throw error

      // Enrich with agent names
      const agentIds = [...new Set((withdrawals || []).map(w => w.agent_id))]
      let agentMap = {}
      if (agentIds.length > 0) {
        const { data: agents } = await supabaseAdmin
          .from('agents')
          .select('id, full_name, phone, email')
          .in('id', agentIds)
        if (agents) {
          agentMap = Object.fromEntries(agents.map(a => [a.id, a]))
        }
      }

      const enriched = (withdrawals || []).map(w => ({
        ...w,
        agent_name: agentMap[w.agent_id]?.full_name || 'Unknown',
        agent_phone: agentMap[w.agent_id]?.phone || '',
        agent_email: agentMap[w.agent_id]?.email || ''
      }))

      return res.status(200).json({ withdrawals: enriched, count: enriched.length })
    }

    // ── PATCH: Approve or reject a withdrawal ──
    if (req.method === 'PATCH') {
      const { withdrawal_id, action, admin_note, processed_by } = req.body
      // action: 'approve' | 'reject'

      if (!withdrawal_id || !action) {
        return res.status(400).json({ error: 'withdrawal_id and action are required' })
      }

      // Fetch the withdrawal
      const { data: wd, error: wdErr } = await supabaseAdmin
        .from('agent_withdrawals')
        .select('*')
        .eq('id', withdrawal_id)
        .limit(1)
      if (wdErr) throw wdErr
      if (!wd || wd.length === 0) return res.status(404).json({ error: 'Withdrawal not found' })

      const withdrawal = wd[0]
      if (withdrawal.status !== 'pending') {
        return res.status(400).json({ error: `Withdrawal already ${withdrawal.status}` })
      }

      if (action === 'approve') {
        // Mark as approved
        await supabaseAdmin
          .from('agent_withdrawals')
          .update({
            status: 'approved',
            admin_note: admin_note || null,
            processed_by: processed_by || 'admin',
            processed_at: new Date().toISOString()
          })
          .eq('id', withdrawal_id)

        // Update agent: move pending to withdrawn, reduce pending_withdrawal
        const { data: agent } = await supabaseAdmin
          .from('agents')
          .select('total_withdrawn, pending_withdrawal')
          .eq('id', withdrawal.agent_id)
          .limit(1)

        const a = (agent && agent[0]) || {}
        const newWithdrawn = (parseFloat(a.total_withdrawn) || 0) + parseFloat(withdrawal.amount)
        const newPending = Math.max(0, (parseFloat(a.pending_withdrawal) || 0) - parseFloat(withdrawal.amount))

        await supabaseAdmin
          .from('agents')
          .update({
            total_withdrawn: newWithdrawn,
            pending_withdrawal: newPending,
            updated_at: new Date().toISOString()
          })
          .eq('id', withdrawal.agent_id)

        return res.status(200).json({
          success: true,
          message: 'Withdrawal approved successfully',
          amount: withdrawal.amount
        })

      } else if (action === 'reject') {
        // Mark as rejected
        await supabaseAdmin
          .from('agent_withdrawals')
          .update({
            status: 'rejected',
            admin_note: admin_note || 'Withdrawal rejected by admin',
            processed_by: processed_by || 'admin',
            processed_at: new Date().toISOString()
          })
          .eq('id', withdrawal_id)

        // Release pending amount back to agent
        const { data: agent } = await supabaseAdmin
          .from('agents')
          .select('pending_withdrawal')
          .eq('id', withdrawal.agent_id)
          .limit(1)

        const a = (agent && agent[0]) || {}
        const newPending = Math.max(0, (parseFloat(a.pending_withdrawal) || 0) - parseFloat(withdrawal.amount))

        await supabaseAdmin
          .from('agents')
          .update({
            pending_withdrawal: newPending,
            updated_at: new Date().toISOString()
          })
          .eq('id', withdrawal.agent_id)

        return res.status(200).json({
          success: true,
          message: 'Withdrawal rejected. Amount returned to agent balance.'
        })
      }

      return res.status(400).json({ error: 'Invalid action. Use approve or reject.' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Admin withdrawal error:', err)
    return res.status(500).json({ error: err.message })
  }
}
