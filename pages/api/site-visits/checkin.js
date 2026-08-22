import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { visit_id, gps_coordinates } = req.body
  if (!visit_id || !gps_coordinates) return res.status(400).json({ error: "visit_id and gps_coordinates required" })

  const { data, error } = await supabaseAdmin
    .from('site_visits')
    .update({ gps_checkin: gps_coordinates, gps_checkin_time: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', visit_id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ success: true, visit: data })
}
