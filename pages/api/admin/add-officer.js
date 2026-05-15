import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized" })
  }

  // DELETE — remove officer
  if (req.method === "DELETE") {
    const { id } = req.body
    const { error } = await supabase.from("officers").delete().eq("id", id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // PATCH — update status
  if (req.method === "PATCH") {
    const { id, status } = req.body
    const { error } = await supabase.from("officers").update({ status }).eq("id", id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // POST — create officer
  if (req.method === "POST") {
    const { full_name, email, phone, role, department, bio, status } = req.body
    if (!full_name || !email) return res.status(400).json({ error: "Name and email required" })

    const { data, error } = await supabase.from("officers").insert([{
      full_name, email, phone: phone || null,
      role: role || "officer",
      department: department || null,
      bio: bio || null,
      status: status || "active"
    }]).select().single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ officer: data })
  }

  return res.status(405).end()
}
