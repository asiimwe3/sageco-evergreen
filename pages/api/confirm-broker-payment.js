import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { broker_id, type } = req.body

  if (!broker_id || !type) {
    return res.status(400).json({ error: "Missing broker_id or type" })
  }

  const allowedTypes = ["registration", "activation"]
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid type" })
  }

  try {
    const updates = type === "activation"
      ? { registration_status: "active", activation_paid: true, registration_paid: true }
      : { registration_status: "registered", registration_paid: true }

    const { error } = await supabaseAdmin
      .from("brokers")
      .update(updates)
      .eq("id", broker_id)

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" })
  }
}
