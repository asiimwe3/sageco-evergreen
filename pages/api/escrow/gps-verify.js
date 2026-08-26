import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../../lib/company.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required" })

  const { escrow_id, gps_lat, gps_lng, property_lat, property_lng, tolerance_meters = 100 } = req.body
  if (!escrow_id || gps_lat == null || gps_lng == null) return res.status(400).json({ error: "escrow_id, gps_lat, gps_lng required" })

  // Haversine distance in meters
  const R = 6371000
  const dLat = (property_lat - gps_lat) * Math.PI / 180
  const dLng = (property_lng - gps_lng) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 + Math.cos(gps_lat * Math.PI / 180) * Math.cos(property_lat * Math.PI / 180) * Math.sin(dLng/2) ** 2
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  const verified = distance <= tolerance_meters

  res.status(200).json({
    verified,
    distance_meters: Math.round(distance),
    tolerance_meters,
    message: verified ? "GPS location verified — within tolerance" : "GPS location does not match property location"
  })
}
