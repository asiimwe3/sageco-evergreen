import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { property_id, verification_type, gps_coordinates, boundary_geojson, drone_images } = req.body
  if (!property_id || !verification_type) return res.status(400).json({ error: "property_id and verification_type required" })

  const { data, error } = await supabaseAdmin
    .from('property_verifications')
    .insert([{
      property_id,
      verification_type,
      gps_coordinates: gps_coordinates || null,
      boundary_geojson: boundary_geojson || null,
      drone_images: drone_images || [],
      verification_status: 'pending'
    }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('properties').update({ verification_status: 'pending' }).eq('id', property_id)

  res.status(200).json({ success: true, verification: data })
}
