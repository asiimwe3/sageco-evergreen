import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { visit_id, notes, visit_report_url } = req.body
  if (!visit_id) return res.status(400).json({ error: "visit_id required" })

  const { data, error } = await supabaseAdmin
    .from('site_visits')
    .update({
      status: 'completed', notes: notes || null,
      visit_report_url: visit_report_url || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', visit_id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ success: true, visit: data })
}
