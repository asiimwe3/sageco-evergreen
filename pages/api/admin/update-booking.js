import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()

  const { id, ...updates } = req.body
  if (!id) return res.status(400).json({ error: "Missing id" })

  // Only allow safe fields to be updated
  const allowedFields = ["status", "confirmed_at", "cancelled_at", "admin_notes", "preferred_date", "time_slot", "notes"]
  const safeUpdates = {}
  for (const key of allowedFields) {
    if (key in updates) safeUpdates[key] = updates[key]
  }

  const { error } = await supabase.from("bookings").update(safeUpdates).eq("id", id)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
