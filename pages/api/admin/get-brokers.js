import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://emldbjqegftrngxypeca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk"
)

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized" })
  }
  const { data, error } = await supabase
    .from("brokers")
    .select("id,full_name,email,phone,plan,plan_expires_at,registration_status,activation_paid,activation_ref,created_at,notes")
    .order("created_at", { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ brokers: data || [] })
}
