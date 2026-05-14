import { createClient } from "@supabase/supabase-js"
import axios from "axios"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PESAPAL_ENV = process.env.PESAPAL_ENV || "live"
const BASE_URL = PESAPAL_ENV === "live"
  ? "https://pay.pesapal.com/v3"
  : "https://cybqa.pesapal.com/pesapalv3"

export default async function handler(req, res) {
  const { orderTrackingId, orderMerchantReference } = req.method === "GET" ? req.query : req.body

  if (!orderTrackingId) {
    return res.status(400).json({ message: "Missing orderTrackingId" })
  }

  try {
    // Get token
    const tokenRes = await axios.post(`${BASE_URL}/api/Auth/RequestToken`, {
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }, { headers: { "Content-Type": "application/json", Accept: "application/json" } })
    const token = tokenRes.data.token

    // Check transaction status
    const statusRes = await axios.get(
      `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    )
    const txn = statusRes.data

    // Log to payment_logs table if it exists
    await supabaseAdmin.from("payment_logs").insert([{
      order_tracking_id: orderTrackingId,
      merchant_reference: orderMerchantReference || null,
      status: txn.payment_status_description || "unknown",
      amount: txn.amount || null,
      currency: txn.currency || "UGX",
      raw_response: txn
    }]).select()

    // Update broker status if this is a broker payment
    if (orderMerchantReference && orderMerchantReference.startsWith("BROKER-")) {
      const parts = orderMerchantReference.split("-")
      const type = parts[1]?.toLowerCase()
      const brokerId = parts[2]

      if (txn.payment_status_description === "Completed" && brokerId) {
        const updates = type === "activation"
          ? { registration_status: "active", activation_paid: true, registration_paid: true }
          : { registration_status: "registered", registration_paid: true }
        await supabaseAdmin.from("brokers").update(updates).eq("id", brokerId)
      }
    }

    return res.status(200).json({ message: "IPN processed", status: txn.payment_status_description })
  } catch (err) {
    console.error("IPN error:", err.message)
    return res.status(200).json({ message: "IPN received" }) // Always 200 to PesaPal
  }
}
