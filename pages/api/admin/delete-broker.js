import { createClient } from "@supabase/supabase-js"
const supabase = createClient("https://emldbjqegftrngxypeca.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk")
const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  if (!ADMIN_SECRET || req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).json({ error: "Unauthorized" })
  const { id } = req.body
  if (!id) return res.status(400).json({ error: "Missing id" })
  const { error } = await supabase.from("brokers").delete().eq("id", id)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
