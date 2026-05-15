import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  try {
    const { title, description, price, location, category, bedrooms, bathrooms, area_sqft, images } = req.body

    if (!title || !price || !location) {
      return res.status(400).json({ error: "Title, price and location are required" })
    }

    const { data, error } = await supabase.from("properties").insert([{
      title,
      description: description || null,
      price: parseFloat(price),
      location,
      category: category || "Residential",
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area_sqft: area_sqft ? parseFloat(area_sqft) : null,
      images: images || [],
      status: "available"
    }]).select().single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ property: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
