import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()
  const { id, status, reply } = req.body
  if (!id) return res.status(400).json({ error: "Missing id" })
  const updates = {}
  if (status) updates.status = status
  if (reply) { updates.reply = reply; updates.replied_at = new Date().toISOString(); updates.status = "replied" }
  const { error } = await supabase.from("contact_messages").update(updates).eq("id", id)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
