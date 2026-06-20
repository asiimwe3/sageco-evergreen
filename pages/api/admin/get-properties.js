import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const ADMIN_SECRET = process.env.ADMIN_SECRET
export default async function handler(req, res) {
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()
  const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ properties: data || [] })
}
