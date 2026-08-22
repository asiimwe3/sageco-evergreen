import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || ""

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).json({ error: "Unauthorized" })
  const { id, status, reply } = req.body
  if (!id) return res.status(400).json({ error: "Missing id" })
  const updates = {}
  if (status) updates.status = status
  if (reply) { updates.reply = reply; updates.replied_at = new Date().toISOString(); updates.status = "replied" }
  const { error } = await supabase.from("contact_messages").update(updates).eq("id", id)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
