import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../../lib/company.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required" })

  const { escrow_id, milestone_index } = req.body
  if (!escrow_id || milestone_index == null) return res.status(400).json({ error: "escrow_id, milestone_index required" })

  const { data: escrow } = await supabaseAdmin.from('escrow_transactions').select('*').eq('id', escrow_id).single()
  if (!escrow) return res.status(404).json({ error: "Escrow not found" })

  // Only the escrow owner can confirm milestones
  if (escrow.user_id !== user.id) return res.status(403).json({ error: "Not authorized to modify this escrow" })

  const milestones = escrow.milestones || []
  if (milestone_index < 0 || milestone_index >= milestones.length) return res.status(400).json({ error: "Invalid milestone index" })

  milestones[milestone_index].status = 'completed'
  milestones[milestone_index].completed_at = new Date().toISOString()

  const allDone = milestones.every(m => m.status === 'completed')
  const newStatus = allDone ? 'completed' : 'in_progress'

  const { data, error } = await supabaseAdmin
    .from('escrow_transactions')
    .update({ milestones, status: newStatus })
    .eq('id', escrow_id)
    .select().single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ escrow: data })
}
