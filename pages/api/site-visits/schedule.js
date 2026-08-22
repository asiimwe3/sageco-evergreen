import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { property_id, visitor_name, visitor_email, visitor_phone, visit_type, scheduled_date, broker_id } = req.body
  if (!property_id || !visitor_name || !visitor_email || !scheduled_date) return res.status(400).json({ error: "property_id, visitor_name, visitor_email, scheduled_date required" })

  const { data, error } = await supabaseAdmin
    .from('site_visits')
    .insert([{
      property_id, visitor_name, visitor_email, visitor_phone,
      visit_type: visit_type || 'physical', scheduled_date, broker_id: broker_id || null,
      status: 'scheduled'
    }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ success: true, visit: data })
}
