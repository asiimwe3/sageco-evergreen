import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://emldbjqegftrngxypeca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk"
)

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Unauthorized" })
  }

  const { broker_id, plan } = req.body
  if (!broker_id || !plan) return res.status(400).json({ error: "Missing broker_id or plan" })

  const validPlans = ["basic", "pro", "premium"]
  if (!validPlans.includes(plan)) return res.status(400).json({ error: "Invalid plan" })

  const startsAt = new Date()
  const expiresAt = new Date(startsAt)
  expiresAt.setDate(expiresAt.getDate() + 30)

  const { error } = await supabase.from("brokers").update({
    plan,
    plan_expires_at: expiresAt.toISOString(),
    activation_paid: true,
    registration_status: "active",
    notes: `manual:${plan}:${startsAt.toISOString().slice(0,10)}`
  }).eq("id", broker_id)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true, expires_at: expiresAt.toISOString() })
}
