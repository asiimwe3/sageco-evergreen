import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || ""

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
