import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req, res) {
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized" })
  }
  const { data, error } = await supabase
    .from("officers")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ officers: data || [] })
}
