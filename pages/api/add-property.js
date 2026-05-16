import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    const {
      title, description, price, location, category, sub_type,
      bedrooms, bathrooms, area_sqft, floor_level,
      land_acres, plot_feet,
      water_available, electricity_available, road_distance_km,
      fence, title_deed, is_negotiable,
      contact_name, contact_phone,
      images, broker_id
    } = req.body

    if (!title || !price || !location) {
      return res.status(400).json({ error: "Title, price and location are required" })
    }

    const s = (v) => typeof v === "string" ? v.trim().slice(0, 500) : v

    const { data, error } = await supabase.from("properties").insert([{
      title: s(title),
      description: s(description) || null,
      price: parseFloat(price),
      location: s(location),
      category: s(category) || "Residential",
      sub_type: s(sub_type) || null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area_sqft: area_sqft ? parseFloat(area_sqft) : null,
      floor_level: s(floor_level) || null,
      land_acres: land_acres ? parseFloat(land_acres) : null,
      plot_feet: s(plot_feet) || null,
      water_available: s(water_available) || null,
      electricity_available: s(electricity_available) || null,
      road_distance_km: road_distance_km ? parseFloat(road_distance_km) : null,
      fence: s(fence) || null,
      title_deed: s(title_deed) || null,
      is_negotiable: is_negotiable || false,
      contact_name: s(contact_name) || null,
      contact_phone: s(contact_phone) || null,
      images: Array.isArray(images) ? images : [],
      status: "available",
      broker_id: broker_id || null,
    }]).select().single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ property: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
