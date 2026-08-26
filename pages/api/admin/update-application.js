import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.ADMIN_SECRET
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).json({ error: "Unauthorized" })
  const { id, ...updates } = req.body
  if (!id) return res.status(400).json({ error: "Missing id" })
  const { error } = await supabase.from("job_applications").update(updates).eq("id", id)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
