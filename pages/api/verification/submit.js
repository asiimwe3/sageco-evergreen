import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../../lib/company.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required" })

  const { property_id, verification_type, drone_data, gps_boundaries, lidar_scan } = req.body
  if (!property_id || !verification_type) return res.status(400).json({ error: "property_id, verification_type required" })

  const { data, error } = await supabaseAdmin.from('property_verifications').insert([{
    property_id, verification_type, drone_data: drone_data || null,
    gps_boundaries: gps_boundaries || null, lidar_scan: lidar_scan || null,
    status: 'submitted', submitted_by: user.id
  }]).select().single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ verification: data })
}
