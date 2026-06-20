import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function generateBrokerId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let id = "SGC-"
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })
  try {
    const { full_name, email, phone, location, specialization, bio, photo_url } = req.body
    if (!full_name || !email || !phone) return res.status(400).json({ error: "Missing required fields" })
    const sanitize = (str) => typeof str === "string" ? str.trim().slice(0, 500) : str

    // Generate unique broker_id — use .maybeSingle() instead of .single() to avoid error on no match
    let broker_id, attempts = 0
    do {
      broker_id = generateBrokerId()
      const { data: existing } = await supabaseAdmin
        .from("brokers")
        .select("id")
        .eq("broker_id", broker_id)
        .maybeSingle()
      if (!existing) break
      attempts++
    } while (attempts < 10)

    if (attempts >= 10) {
      return res.status(500).json({ error: "Could not generate unique broker ID. Please try again." })
    }

    const { data, error } = await supabaseAdmin.from("brokers").insert([{
      full_name: sanitize(full_name),
      email: sanitize(email),
      phone: sanitize(phone),
      location: sanitize(location),
      specialization: sanitize(specialization),
      bio: sanitize(bio),
      photo_url: photo_url ? sanitize(photo_url) : null,
      broker_id,
      registration_status: "pending",
      plan: "free"
    }]).select().single()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ broker: data })
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" })
  }
}
