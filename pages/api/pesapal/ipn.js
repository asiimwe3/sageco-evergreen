import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://pay.pesapal.com/v3'
const CONSUMER_KEY = 'NL6lp3bu17Oyp4ykldKhezVWakIGlF5w'
const CONSUMER_SECRET = 'LqCRWimK9fH5HvuVwkzKsDS8Xbc='

const supabaseAdmin = createClient(
  'https://emldbjqegftrngxypeca.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk'
)

async function getToken() {
  const res = await axios.post(`${BASE_URL}/api/Auth/RequestToken`, {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
  }, { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } })
  return res.data.token
}

export default async function handler(req, res) {
  const { orderTrackingId, orderMerchantReference } = req.query

  if (!orderTrackingId) return res.status(400).json({ error: 'Missing orderTrackingId' })

  try {
    const token = await getToken()

    // Get transaction status from PesaPal
    const statusRes = await axios.get(
      `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    )

    const { payment_status_description, amount } = statusRes.data

    if (payment_status_description === 'Completed') {
      const ref = orderMerchantReference || ''

      // Update broker record based on reference
      if (ref.startsWith('BROKER-REGISTRATION-')) {
        const brokerId = ref.replace('BROKER-REGISTRATION-', '').split('-')[0]
        // Find broker by partial ID match
        const { data: brokers } = await supabaseAdmin
          .from('brokers')
          .select('id')
          .ilike('id', `${brokerId}%`)
          .limit(1)

        if (brokers && brokers.length > 0) {
          await supabaseAdmin.from('brokers').update({
            registration_paid: true,
            registration_status: 'registered',
            registration_ref: orderTrackingId
          }).eq('id', brokers[0].id)
        }
      } else if (ref.startsWith('BROKER-ACTIVATION-')) {
        const brokerId = ref.replace('BROKER-ACTIVATION-', '').split('-')[0]
        const { data: brokers } = await supabaseAdmin
          .from('brokers')
          .select('id')
          .ilike('id', `${brokerId}%`)
          .limit(1)

        if (brokers && brokers.length > 0) {
          await supabaseAdmin.from('brokers').update({
            activation_paid: true,
            registration_status: 'active',
            activation_ref: orderTrackingId
          }).eq('id', brokers[0].id)
        }
      }
    }

    return res.status(200).json({ status: 'ok' })
  } catch (err) {
    console.error('IPN error:', err.response?.data || err.message)
    return res.status(500).json({ error: err.message })
  }
}
