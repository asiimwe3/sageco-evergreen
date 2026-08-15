import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  const { id, email, full_name, role } = req.body
  if (!id || !email) return res.status(400).json({ error: "Missing id or email" })

  const { data, error } = await supabase.from("user_profiles").upsert([{
    id, email, full_name: full_name || email.split("@")[0], role: role || "customer"
  }], { onConflict: "id" }).select().single()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ profile: data })
}
