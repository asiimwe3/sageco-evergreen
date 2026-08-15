// SageCo Evergreen — PesaPal Initiate (direct PesaPal + Supabase, no Base44 proxy)
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.PESAPAL_ENV === 'sandbox'
  ? 'https://cybqa.pesapal.com/v3'
  : 'https://pay.pesapal.com/v3'
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET
const IPN_ID = process.env.PESAPAL_IPN_ID
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sageco-evergreen.vercel.app'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eiyexnuhqdscomilwpqg.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc'
const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return res.status(500).json({ error: 'PesaPal credentials not configured' })
  }

  const { amount, currency = 'UGX', description, email, phone, first_name, last_name, reference, callback_url } = req.body

  if (!amount || !email || !phone || !reference) {
    return res.status(400).json({ error: 'Missing required payment fields' })
  }

  try {
    // 1. Get PesaPal token
    const tokenRes = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.token) return res.status(502).json({ error: 'PesaPal auth failed' })

    // 2. Submit order
    const callbackUrl = callback_url || `${SITE_URL}/payment-success`
    const orderRes = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        id: reference,
        currency,
        amount: parseFloat(amount),
        description,
        callback_url: callbackUrl,
        notification_id: IPN_ID,
        billing_address: {
          email_address: email,
          phone_number: phone,
          first_name: first_name || 'Customer',
          last_name: last_name || 'SAGECO',
          country_code: 'UG',
        }
      })
    })
    const orderData = await orderRes.json()

    if (!orderData.redirect_url) {
      return res.status(502).json({ error: orderData.error?.message || 'Order failed' })
    }

    // 3. Record transaction in Supabase (fast, direct)
    try {
      await supabaseAdmin.from('transactions').insert([{
        reference,
        type: reference.startsWith('VIEWING') ? 'viewing_fee'
            : reference.startsWith('BROKER') ? 'broker_registration'
            : 'property_purchase',
        status: 'pending',
        amount: parseFloat(amount),
        currency,
        customer_email: email,
        customer_phone: phone,
        customer_name: `${first_name || ''} ${last_name || ''}`.trim(),
        description,
        pesapal_order_tracking_id: orderData.order_tracking_id || null,
      }])
    } catch (e) {
      console.warn('[pesapal] Transaction record failed:', e.message)
    }

    return res.status(200).json({
      success: true,
      redirect_url: orderData.redirect_url,
      order_tracking_id: orderData.order_tracking_id,
      reference
    })
  } catch (err) {
    console.error('[pesapal/initiate]', err.message)
    return res.status(500).json({ error: 'Payment initiation failed' })
  }
}
