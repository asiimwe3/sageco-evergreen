import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin.js'
const PLAN_PRICES = { basic: 15000, pro: 25000, premium: 30000 }
const PLAN_DAYS = { basic: 30, pro: 30, premium: 30 }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { plan, amount_ugx, pesapal_ref, full_name, email, phone, broker_id } = req.body
  if (!plan || !pesapal_ref || !full_name || !email) return res.status(400).json({ error: "Missing required fields" })

  const expectedAmount = PLAN_PRICES[plan]
  if (!expectedAmount) return res.status(400).json({ error: "Invalid plan" })
  if (amount_ugx !== expectedAmount) return res.status(400).json({ error: "Invalid amount" })

  try {
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + (PLAN_DAYS[plan] || 30))

    if (broker_id) {
      await supabase.from("brokers")
        .update({ plan, notes: `pending:${pesapal_ref}`, plan_expires_at: expiresAt.toISOString() })
        .eq("id", broker_id)
    } else {
      await supabase.from("contact_messages").insert([{
        name: full_name,
        email,
        message: `SUBSCRIPTION_INTENT|plan=${plan}|amount=${amount_ugx}|ref=${pesapal_ref}|phone=${phone}`,
        status: "subscription_pending"
      }])
    }
    return res.status(200).json({ ok: true, ref: pesapal_ref, expires_at: expiresAt.toISOString() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
