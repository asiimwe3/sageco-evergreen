import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Broker plan limits
const PLAN_LIMITS = {
  free:    3,
  basic:   10,
  pro:     50,
  premium: Infinity,
}

export const config = { api: { bodyParser: { sizeLimit: "2mb" } } }

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

    // ── Validation ──────────────────────────────────────────────────────────
    if (!title || !price || !location) {
      return res.status(400).json({ error: "Title, price and location are required" })
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ error: "Price must be a valid positive number" })
    }

    const VALID_CATEGORIES = ['Residential', 'Commercial', 'Land', 'Plot', 'Green Project']
    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` })
    }

    if (images && !Array.isArray(images)) {
      return res.status(400).json({ error: "Images must be an array" })
    }

    // ── Broker plan limit enforcement ────────────────────────────────────────
    if (broker_id) {
      const { data: broker } = await supabase
        .from("brokers")
        .select("plan, registration_status")
        .eq("id", broker_id)
        .single()

      if (broker) {
        // Block inactive brokers from listing
        if (broker.registration_status === 'pending') {
          return res.status(403).json({ error: "Your broker account is pending approval. Please wait for activation before listing properties." })
        }

        const plan = broker.plan || "free"
        const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free

        if (limit !== Infinity) {
          const { count } = await supabase
            .from("properties")
            .select("id", { count: "exact", head: true })
            .eq("broker_id", broker_id)
            .neq("status", "deleted")

          if (count >= limit) {
            return res.status(403).json({
              error: `Your ${plan} plan allows a maximum of ${limit} listing${limit === 1 ? "" : "s"}. Please upgrade to add more.`,
              limit,
              plan,
            })
          }
        }
      }
    }

    const s = (v, maxLen = 500) => typeof v === "string" ? v.trim().slice(0, maxLen) : v

    const { data, error } = await supabase.from("properties").insert([{
      title:                  s(title, 200),
      description:            s(description, 5000) || null,
      price:                  parseFloat(price),
      location:               s(location, 300),
      category:               s(category) || "Residential",
      sub_type:               s(sub_type) || null,
      bedrooms:               bedrooms  ? parseInt(bedrooms)  : null,
      bathrooms:              bathrooms ? parseInt(bathrooms) : null,
      area_sqft:              area_sqft ? parseFloat(area_sqft) : null,
      floor_level:            s(floor_level) || null,
      land_acres:             land_acres ? parseFloat(land_acres) : null,
      plot_feet:              s(plot_feet) || null,
      water_available:        s(water_available) || null,
      electricity_available:  s(electricity_available) || null,
      road_distance_km:       road_distance_km ? parseFloat(road_distance_km) : null,
      fence:                  s(fence) || null,
      title_deed:             s(title_deed) || null,
      is_negotiable:          is_negotiable || false,
      contact_name:           s(contact_name) || null,
      contact_phone:          s(contact_phone) || null,
      images:                 Array.isArray(images) ? images.slice(0, 12) : [],
      // FIX: set pending so admin reviews before going live
      status:                 "pending",
      broker_id:              broker_id || null,
      views:                  0,
    }]).select().single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ property: data, message: "Property submitted for review. It will appear in listings once approved." })

  } catch (err) {
    console.error("add-property error:", err)
    return res.status(500).json({ error: "Internal server error. Please try again." })
  }
}
