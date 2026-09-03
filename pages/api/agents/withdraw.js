// Agent Withdrawal API — request, list, and manage withdrawals
import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const SB_URL = process.env.SUPABASE_URL || "https://emldbjqegftrngxypeca.supabase.co"
  const SR_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  // ── POST: Create a withdrawal request ──
  if (req.method === 'POST') {
    const { agent_id, amount, method, phone_number, account_name } = req.body

    if (!agent_id || !amount) {
      return res.status(400).json({ error: 'Agent ID and amount are required' })
    }
    if (amount < 1000) {
      return res.status(400).json({ error: 'Minimum withdrawal is UGX 1,000' })
    }

    try {
      // 1. Fetch agent and check balance
      const { data: agent } = await supabaseAdmin
        .from('agents').select('*').eq('id', agent_id).limit(1)
      if (!agent || agent.length === 0) {
        return res.status(404).json({ error: 'Agent not found' })
      }

      const a = agent[0]
      const totalEarnings = parseFloat(a.total_earnings) || 0
      const totalWithdrawn = parseFloat(a.total_withdrawn) || 0
      const pendingWithdrawal = parseFloat(a.pending_withdrawal) || 0
      const available = totalEarnings - totalWithdrawn - pendingWithdrawal

      if (amount > available) {
        return res.status(400).json({
          error: `Insufficient balance. Available: UGX ${available.toLocaleString()}`,
          available_balance: available
        })
      }

      // 2. Check for existing pending withdrawals
      const { data: existingPending } = await supabaseAdmin
        .from('agent_withdrawals')
        .select('id, amount')
        .eq('agent_id', agent_id)
        .eq('status', 'pending')
      if (existingPending && existingPending.length > 0) {
        return res.status(400).json({ error: 'You already have a pending withdrawal request. Please wait for it to be processed.' })
      }

      // 3. Generate reference
      const ref = 'WD-' + Date.now().toString(36).toUpperCase()

      // 4. Create withdrawal record
      const { data: withdrawal, error: wErr } = await supabaseAdmin
        .from('agent_withdrawals')
        .insert({
          agent_id,
          amount: parseFloat(amount),
          method: method || 'mobile_money',
          phone_number: phone_number || a.phone,
          account_name: account_name || a.full_name,
          status: 'pending',
          reference: ref
        })
        .select()

      if (wErr) throw wErr

      // 5. Update agent's pending_withdrawal
      const newPending = pendingWithdrawal + parseFloat(amount)
      await supabaseAdmin
        .from('agents')
        .update({ pending_withdrawal: newPending, updated_at: new Date().toISOString() })
        .eq('id', agent_id)

      return res.status(200).json({
        success: true,
        message: 'Withdrawal request submitted successfully',
        withdrawal: withdrawal[0],
        reference: ref
      })

    } catch (err) {
      console.error('Withdrawal error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // ── GET: List withdrawals for an agent ──
  if (req.method === 'GET') {
    const { agent_id } = req.query
    if (!agent_id) return res.status(400).json({ error: 'Agent ID is required' })

    try {
      const { data: withdrawals, error } = await supabaseAdmin
        .from('agent_withdrawals')
        .select('*')
        .eq('agent_id', agent_id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get balance info
      const { data: agent } = await supabaseAdmin
        .from('agents')
        .select('total_earnings, total_withdrawn, pending_withdrawal')
        .eq('id', agent_id)
        .limit(1)

      const a = (agent && agent[0]) || {}
      const totalEarnings = parseFloat(a.total_earnings) || 0
      const totalWithdrawn = parseFloat(a.total_withdrawn) || 0
      const pendingWithdrawal = parseFloat(a.pending_withdrawal) || 0
      const available = totalEarnings - totalWithdrawn - pendingWithdrawal

      return res.status(200).json({
        withdrawals: withdrawals || [],
        balance: {
          total_earnings: totalEarnings,
          total_withdrawn: totalWithdrawn,
          pending_withdrawal: pendingWithdrawal,
          available_balance: available
        }
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
