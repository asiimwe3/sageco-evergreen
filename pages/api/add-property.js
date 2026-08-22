// SageCo Evergreen — Add Property (direct Supabase, no Base44 proxy)
import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../lib/supabaseAdmin.js'
const supabaseUrl = SUPA_URL
const supabaseKey = SUPA_KEY
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Auth required' })

    const body = req.body
    const required = ['title', 'price', 'location']
    for (const field of required) {
      if (!body[field]) return res.status(400).json({ error: `Missing: ${field}` })
    }

    const price = parseFloat(body.price)
    if (isNaN(price) || price <= 0) return res.status(400).json({ error: 'Invalid price' })

    const validCategories = ['Residential', 'Commercial', 'Land', 'Green Project']
    if (body.category && !validCategories.includes(body.category)) {
      return res.status(400).json({ error: 'Invalid category' })
    }

    // Verify user token
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseKey, Authorization: authHeader }
    })
    if (!userRes.ok) return res.status(401).json({ error: 'Invalid token' })
    const userData = await userRes.json()

    const { data, error } = await supabaseAdmin.from('properties').insert([{
      title: body.title,
      description: body.description || null,
      price,
      location: body.location,
      category: body.category || 'Residential',
      bedrooms: body.bedrooms ? parseInt(body.bedrooms) : null,
      bathrooms: body.bathrooms ? parseInt(body.bathrooms) : null,
      area_sqft: body.area_sqft ? parseFloat(body.area_sqft) : null,
      images: body.images || [],
      broker_id: userData.id,
      status: 'available',
      gps_lat: body.gps_lat || null,
      gps_lng: body.gps_lng || null,
      gps_coordinates: body.gps_lat && body.gps_lng ? `${body.gps_lat},${body.gps_lng}` : null,
      water_available: body.water_available || null,
      electricity_available: body.electricity_available || null,
      road_distance_km: body.road_distance_km || null,
      fence: body.fence || null,
      title_deed: body.title_deed || null,
      land_acres: body.land_acres || null,
      plot_feet: body.plot_feet || null,
      is_negotiable: body.is_negotiable || false,
      contact_name: body.contact_name || null,
      contact_phone: body.contact_phone || null,
    }]).select().single()

    if (error) return res.status(500).json({ error: error.message })

    return res.status(201).json({ success: true, property: data })
  } catch (err) {
    console.error('[add-property]', err.message)
    return res.status(500).json({ error: 'Failed to add property' })
  }
}
