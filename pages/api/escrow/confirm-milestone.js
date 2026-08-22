import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { escrow_id, milestone_index } = req.body
  if (!escrow_id || milestone_index === undefined) return res.status(400).json({ error: "escrow_id and milestone_index required" })

  const { data: escrow } = await supabaseAdmin.from('escrow_transactions').select('*').eq('id', escrow_id).single()
  if (!escrow) return res.status(404).json({ error: "Escrow not found" })

  const milestones = escrow.milestones || []
  if (milestone_index < 0 || milestone_index >= milestones.length) return res.status(400).json({ error: "Invalid milestone index" })

  milestones[milestone_index].status = 'completed'
  milestones[milestone_index].completed_at = new Date().toISOString()

  const allCompleted = milestones.every(m => m.status === 'completed')

  const { data, error } = await supabaseAdmin
    .from('escrow_transactions')
    .update({
      milestones,
      status: allCompleted ? 'completed' : 'active',
      ...(allCompleted ? { completed_at: new Date().toISOString() } : {}),
      updated_at: new Date().toISOString()
    })
    .eq('id', escrow_id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ success: true, escrow: data, all_completed: allCompleted })
}
