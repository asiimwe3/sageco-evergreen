import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  "https://eiyexnuhqdscomilwpqg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc"
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
