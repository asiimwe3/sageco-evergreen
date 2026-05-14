import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const {
    reference, property_id, property_title,
    broker_id, broker_name,
    customer_name, customer_email, customer_phone,
    preferred_date, message,
    total_amount, business_share, broker_share,
    payment_type, status
  } = req.body

  try {
    const { data, error } = await supabase.from("bookings").insert([{
      reference,
      property_id: property_id || null,
      property_title,
      broker_id: broker_id || null,
      broker_name: broker_name || null,
      customer_name,
      customer_email,
      customer_phone,
      preferred_date,
      message: message || null,
      total_amount,
      business_share,
      broker_share,
      payment_type,
      status: status || "pending"
    }]).select().single()

    if (error) {
      console.error("Booking save error:", error)
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json({ booking: data })
  } catch (err) {
    console.error("Save booking error:", err.message)
    return res.status(500).json({ error: err.message })
  }
}
