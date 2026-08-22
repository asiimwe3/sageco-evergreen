import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { property_id, passport_id } = req.query
  if (!property_id && !passport_id) return res.status(400).json({ error: "property_id or passport_id required" })

  let query = supabaseAdmin.from('land_passports').select('*, properties(title, location, price, category, images, contact_name)').limit(1)
  if (property_id) query = query.eq('property_id', property_id)
  if (passport_id) query = query.eq('passport_id', passport_id)

  const { data, error } = await query.single()
  if (error) return res.status(404).json({ error: "Passport not found" })
  res.status(200).json({ passport: data })
}
