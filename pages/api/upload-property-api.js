// Property limits per broker plan
import { supabaseAdmin } from '../../lib/supabaseAdmin.js'
const PLAN_LIMITS = {
  free:    3,
  basic:   10,
  pro:     50,
  premium: Infinity,
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  try {
    const {
      title, description, price, location, category,
      bedrooms, bathrooms, area_sqft, images, broker_id
    } = req.body

    if (!title || !price || !location) {
      return res.status(400).json({ error: "Missing required fields: title, price, location" })
    }

    // Enforce listing limit if broker_id is provided
    if (broker_id) {
      const { data: broker } = await supabaseAdmin
        .from("brokers")
        .select("plan")
        .eq("id", broker_id)
        .single()

      if (broker) {
        const plan = broker.plan || "free"
        const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free

        if (limit !== Infinity) {
          const { count } = await supabaseAdmin
            .from("properties")
            .select("id", { count: "exact", head: true })
            .eq("broker_id", broker_id)

          if (count >= limit) {
            return res.status(403).json({
              error: `Your ${plan} plan allows a maximum of ${limit} property listing${limit === 1 ? "" : "s"}. Please upgrade your plan to add more.`,
              limit,
              plan,
            })
          }
        }
      }
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
      status: "pending",
      broker_id: broker_id || null,
    }]).select().single()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ property: data })
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" })
  }
}
