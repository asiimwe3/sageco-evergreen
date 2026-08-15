import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://eiyexnuhqdscomilwpqg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc"
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const {
    reference, property_id, property_title,
    broker_id, broker_name,
    customer_name, customer_email, customer_phone,
    preferred_date, time_slot, booking_type, message, whatsapp_updates,
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
      time_slot: time_slot || null,
      booking_type: booking_type || "viewing",
      message: message || null,
      whatsapp_updates: whatsapp_updates !== false,
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

    // Also try to send confirmation email if email service is available
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer_name,
          email: customer_email,
          message: `Booking confirmation: ${reference} for ${property_title || booking_type} on ${preferred_date} (${time_slot || "TBD"})`,
          internal: true
        })
      })
    } catch {}

    return res.status(200).json({ booking: data })
  } catch (err) {
    console.error("Save booking error:", err.message)
    return res.status(500).json({ error: err.message })
  }
}
