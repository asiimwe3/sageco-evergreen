import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PLAN_PRICES = { basic: 15000, pro: 25000, premium: 30000 }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { plan, amount_ugx, pesapal_ref, full_name, email, phone, broker_id } = req.body

  if (!plan || !pesapal_ref || !full_name || !email) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const expectedAmount = PLAN_PRICES[plan]
  if (!expectedAmount) return res.status(400).json({ error: "Invalid plan" })
  if (amount_ugx !== expectedAmount) return res.status(400).json({ error: "Invalid amount" })

  try {
    // If existing broker, record the plan intent on their record
    if (broker_id) {
      await supabase.from("brokers")
        .update({ plan, notes: `pending:${pesapal_ref}` })
        .eq("id", broker_id)
    }

    // Store subscription intent in notes (we'll use the brokers table or a simple log)
    // For new brokers: log to contact_messages as a subscription intent record
    if (!broker_id) {
      await supabase.from("contact_messages").insert([{
        name: full_name,
        email,
        message: `SUBSCRIPTION_INTENT|plan=${plan}|amount=${amount_ugx}|ref=${pesapal_ref}|phone=${phone}`,
        status: "subscription_pending"
      }])
    }

    return res.status(200).json({ ok: true, ref: pesapal_ref })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
