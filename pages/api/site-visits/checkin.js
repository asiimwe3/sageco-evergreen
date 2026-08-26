import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../../lib/company.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required" })

  const { visit_id, gps_lat, gps_lng } = req.body
  if (!visit_id) return res.status(400).json({ error: "visit_id required" })

  const { data: visit } = await supabaseAdmin.from('site_visits').select('*').eq('id', visit_id).single()
  if (!visit) return res.status(404).json({ error: "Visit not found" })
  if (visit.user_id !== user.id) return res.status(403).json({ error: "Not authorized" })

  const { data, error } = await supabaseAdmin.from('site_visits')
    .update({
      status: 'checked_in',
      gps_checkin: gps_lat && gps_lng ? `${gps_lat},${gps_lng}` : null,
      gps_checkin_time: new Date().toISOString()
    })
    .eq('id', visit_id)
    .select().single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ visit: data })
}
