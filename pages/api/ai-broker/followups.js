import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).json({ error: "Forbidden" })
    const { status } = req.query
    let query = supabaseAdmin.from('broker_followups').select('*').order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ followups: data || [] })
  }

  if (req.method === 'POST') {
    const { customer_name, customer_phone, customer_email, inquiry_type, message, property_id, assigned_broker_id } = req.body
    const { data, error } = await supabaseAdmin.from('broker_followups').insert([{
      customer_name, customer_phone, customer_email, inquiry_type: inquiry_type || 'general',
      message, property_id: property_id || null, assigned_broker_id: assigned_broker_id || null,
      status: 'pending'
    }]).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, followup: data })
  }

  res.status(405).json({ error: "Method not allowed" })
}
