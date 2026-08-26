import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../../lib/company.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required" })

  const { property_id, visitor_name, visitor_email, visitor_phone, visit_type, scheduled_date, broker_id } = req.body
  if (!property_id || !visitor_name || !visitor_email || !scheduled_date) return res.status(400).json({ error: "property_id, visitor_name, visitor_email, scheduled_date required" })

  const { data, error } = await supabaseAdmin
    .from('site_visits')
    .insert([{
      property_id, visitor_name, visitor_email, visitor_phone,
      visit_type: visit_type || 'physical', scheduled_date, broker_id: broker_id || null,
      status: 'scheduled', user_id: user.id
    }])
    .select().single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ visit: data })
}
