import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { property_id, gps_coordinates, boundary_coordinates, area_measured, survey_date, drone_images } = req.body
  if (!property_id) return res.status(400).json({ error: "property_id required" })

  const passport_id = `SAGE-PASS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  const { data: property } = await supabaseAdmin.from('properties').select('*').eq('id', property_id).single()
  if (!property) return res.status(404).json({ error: "Property not found" })

  const ownership_history = [{
    owner: property.contact_name || 'Unknown',
    date: property.created_at,
    type: 'initial_listing'
  }]

  const { data, error } = await supabaseAdmin
    .from('land_passports')
    .insert([{
      property_id, passport_id,
      gps_coordinates: gps_coordinates || null,
      boundary_coordinates: boundary_coordinates || null,
      area_measured: area_measured || null,
      survey_date: survey_date || null,
      drone_images: drone_images || [],
      ownership_history,
      status: 'issued',
      issued_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  await supabaseAdmin.from('properties').update({ passport_id }).eq('id', property_id)
  res.status(200).json({ success: true, passport: data })
}
