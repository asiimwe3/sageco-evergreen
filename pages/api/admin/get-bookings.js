import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || ""

export default async function handler(req, res) {
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).json({ error: "Unauthorized" })
  const { status, from, to } = req.query
  let query = supabase.from("bookings").select("*").order("created_at", { ascending: false })
  if (status && status !== "all") query = query.eq("status", status)
  if (from) query = query.gte("preferred_date", from)
  if (to) query = query.lte("preferred_date", to)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ bookings: data || [] })
}
