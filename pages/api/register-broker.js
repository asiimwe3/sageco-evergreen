import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  try {
    const { full_name, email, phone, location, specialization, bio, photo_url } = req.body

    if (!full_name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Basic input sanitization
    const sanitize = (str) => typeof str === "string" ? str.trim().slice(0, 500) : str

    const { data, error } = await supabaseAdmin.from("brokers").insert([{
      full_name: sanitize(full_name),
      email: sanitize(email),
      phone: sanitize(phone),
      location: sanitize(location),
      specialization: sanitize(specialization),
      bio: sanitize(bio),
      photo_url: sanitize(photo_url),
      registration_status: "pending"
    }]).select().single()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ broker: data })
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" })
  }
}
