import axios from 'axios'

const PESAPAL_ENV = process.env.PESAPAL_ENV || 'live'
const BASE_URL = PESAPAL_ENV === 'live'
  ? 'https://pay.pesapal.com/v3'
  : 'https://cybqa.pesapal.com/pesapalv3'

async function getToken() {
  const res = await axios.post(`${BASE_URL}/api/Auth/RequestToken`, {
    consumer_key: process.env.PESAPAL_CONSUMER_KEY,
    consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
  }, { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } })
  return res.data.token
}

async function registerIPN(token, siteUrl) {
  const res = await axios.post(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
    url: `${siteUrl}/api/pesapal/ipn`,
    ipn_notification_type: 'GET'
  }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' } })
  return res.data.ipn_id
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const {
    amount, currency = 'UGX', description, email, phone,
    first_name, last_name, reference, callback_url
  } = req.body

  try {
    const token = await getToken()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sageco-evergreen.vercel.app'
    const ipn_id = await registerIPN(token, siteUrl)
    const callbackUrl = callback_url || `${siteUrl}/payment-success`

    const orderRes = await axios.post(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      id: reference || `ORDER-${Date.now()}`,
      currency,
      amount,
      description,
      callback_url: callbackUrl,
      notification_id: ipn_id,
      billing_address: {
        email_address: email,
        phone_number: phone,
        first_name,
        last_name,
        country_code: 'UG',
      }
    }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' } })

    return res.status(200).json({
      redirect_url: orderRes.data.redirect_url,
      order_tracking_id: orderRes.data.order_tracking_id
    })
  } catch (err) {
    console.error('PesaPal error:', err.response?.data || err.message)
    return res.status(500).json({ error: 'Payment initiation failed', detail: err.response?.data || err.message })
  }
}
