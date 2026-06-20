import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.PESAPAL_ENV === 'sandbox' 
  ? 'https://cybqa.pesapal.com/v3' 
  : 'https://pay.pesapal.com/v3'
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getToken() {
  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
  })
  const data = await res.json()
  return data.token
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

    if (statusData.payment_status_description !== 'Completed') {
      return res.status(200).json({ status: 'pending' })
    }

    const ref = orderMerchantReference || ''

    if (ref.startsWith('BROKER-REG-')) {
      const partialId = ref.replace('BROKER-REG-', '')
      const { data: brokers } = await supabaseAdmin.from('brokers').select('id').ilike('id', `${partialId}%`).limit(1)
      if (brokers?.length > 0) {
        await supabaseAdmin.from('brokers').update({
          registration_paid: true,
          registration_status: 'registered',
          registration_ref: orderTrackingId
        }).eq('id', brokers[0].id)
      }
    }

    if (ref.startsWith('BROKER-PLAN-')) {
      const parts = ref.split('-')
      const plan = parts[2]?.toLowerCase()
      const partialId = parts[3]
      const { data: brokers } = await supabaseAdmin.from('brokers').select('id').ilike('id', `${partialId}%`).limit(1)
      if (brokers?.length > 0) {
        await supabaseAdmin.from('brokers').update({
          activation_paid: true,
          registration_status: 'active',
          activation_ref: `${plan}:${orderTrackingId}`
        }).eq('id', brokers[0].id)
      }
    }

    return res.status(200).json({ status: 'ok' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
