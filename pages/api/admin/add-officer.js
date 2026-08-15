import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req, res) {
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized" })
  }

  if (req.method === "DELETE") {
    const { id } = req.body
    const { error } = await supabase.from("officers").delete().eq("id", id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  if (req.method === "PATCH") {
    const { id, status, photo_url } = req.body
    const updateData = {}
    if (status !== undefined) updateData.status = status
    if (photo_url !== undefined) updateData.photo_url = photo_url
    const { error } = await supabase.from("officers").update(updateData).eq("id", id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  if (req.method === "POST") {
    const { full_name, email, phone, role, department, bio, status, photo_url } = req.body
    if (!full_name || !email) return res.status(400).json({ error: "Name and email required" })

    const { data, error } = await supabase.from("officers").insert([{
      full_name,
      email,
      phone: phone || null,
      role: role || "officer",
      department: department || null,
      bio: bio || null,
      status: status || "active",
      photo_url: photo_url || null,
    }]).select().single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ officer: data })
  }

  return res.status(405).end()
}
