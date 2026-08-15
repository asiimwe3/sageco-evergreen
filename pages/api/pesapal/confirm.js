// Called by payment-success page to confirm status of any PesaPal order
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.PESAPAL_ENV === 'sandbox'
  ? 'https://cybqa.pesapal.com/v3'
  : 'https://pay.pesapal.com/v3'
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET

const supabase = createClient(
  "https://eiyexnuhqdscomilwpqg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc"
)

async function getToken() {
  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
  })
  const d = await res.json()
  return d.token
}

export default async function handler(req, res) {
  const { orderTrackingId, orderMerchantReference } = req.query
  if (!orderTrackingId) return res.status(400).json({ error: 'Missing orderTrackingId' })

  try {
    const token = await getToken()
    const statusRes = await fetch(
      `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    )
    const statusData = await statusRes.json()
    const isComplete = statusData.payment_status_description === 'Completed'

    // If complete, update booking status
    if (isComplete && orderMerchantReference?.startsWith('BOOKING-')) {
      await supabase.from('bookings').update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        payment_ref: orderTrackingId
      }).eq('reference', orderMerchantReference)
    }

    return res.status(200).json({
      status: statusData.payment_status_description,
      complete: isComplete,
      amount: statusData.amount,
      currency: statusData.currency,
      tracking_id: orderTrackingId
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
