import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  try {
    const {
      title, description, price, location, category,
      bedrooms, bathrooms, area_sqft, images
    } = req.body

    if (!title || !price || !location) {
      return res.status(400).json({ error: "Missing required fields: title, price, location" })
    }

    const sanitize = (str) => typeof str === "string" ? str.trim().slice(0, 1000) : str

    const { data, error } = await supabaseAdmin.from("properties").insert([{
      title: sanitize(title),
      description: sanitize(description),
      price: parseFloat(price),
      location: sanitize(location),
      category: sanitize(category),
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area_sqft: area_sqft ? parseFloat(area_sqft) : null,
      images: Array.isArray(images) ? images : [],
      status: "pending"
    }]).select().single()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ property: data })
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" })
  }
}
