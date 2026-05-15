import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BASE_URL = "https://pay.pesapal.com/v3"
const CONSUMER_KEY = "NL6lp3bu17Oyp4ykldKhezVWakIGlF5w"
const CONSUMER_SECRET = "LqCRWimK9fH5HvuVwkzKsDS8Xbc="

async function getToken() {
  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
  })
  const data = await res.json()
  return data.token
}

const PLAN_DURATIONS = { basic: 30, pro: 30, premium: 30 }

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end()

  const { ref, orderTrackingId, plan } = req.query
  if (!orderTrackingId || !ref) return res.status(400).json({ error: "Missing params" })

  try {
    const token = await getToken()
    const statusRes = await fetch(
      `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    )
    const statusData = await statusRes.json()

    if (statusData.payment_status_description !== "Completed") {
      return res.status(200).json({ status: "pending" })
    }

    // Payment confirmed — activate subscription
    const days = PLAN_DURATIONS[plan] || 30
    const startsAt = new Date()
    const expiresAt = new Date(startsAt)
    expiresAt.setDate(expiresAt.getDate() + days)

    // Find broker by ref in notes or by email
    const { data: brokers } = await supabase
      .from("brokers")
      .select("id")
      .ilike("notes", `%${ref.slice(-12)}%`)
      .limit(1)

    if (brokers?.length > 0) {
      await supabase.from("brokers").update({
        plan: plan || "basic",
        plan_expires_at: expiresAt.toISOString(),
        activation_paid: true,
        registration_status: "active",
        activation_ref: `${plan}:${orderTrackingId}`,
        notes: `active:${ref}`
      }).eq("id", brokers[0].id)
    }

    // Mark contact_messages subscription intent as complete
    await supabase.from("contact_messages")
      .update({ status: "subscription_active" })
      .ilike("message", `%ref=${ref}%`)

    return res.status(200).json({ status: "active", expires_at: expiresAt.toISOString() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
