import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()
  const { search, status, category } = req.query
  let query = supabase.from("properties").select("*").order("created_at", { ascending: false })
  if (status && status !== "all") query = query.eq("status", status)
  if (category && category !== "all") query = query.eq("category", category)
  if (search) query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ properties: data || [] })
}
