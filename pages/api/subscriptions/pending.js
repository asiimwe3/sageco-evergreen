import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized" })
  }
  // Get pending subscription intents from contact_messages
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("status", "subscription_pending")
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  const pending = (data || []).map(row => {
    const parts = (row.message || "").split("|")
    const parsed = {}
    parts.slice(1).forEach(p => {
      const [k, v] = p.split("=")
      if (k && v) parsed[k] = v
    })
    return {
      name: row.name,
      email: row.email,
      plan: parsed.plan || "unknown",
      amount: parsed.amount,
      ref: parsed.ref,
      phone: parsed.phone,
      created_at: row.created_at
    }
  })

  return res.status(200).json({ pending })
}
