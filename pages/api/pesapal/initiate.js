import axios from 'axios'

const PESAPAL_ENV = process.env.PESAPAL_ENV || 'sandbox'
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

async function registerIPN(token) {
  const res = await axios.post(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/pesapal/ipn`,
    ipn_notification_type: 'POST'
  }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' } })
  return res.data.ipn_id
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { name, email, phone, amount, date, message } = req.body
  try {
    const token = await getToken()
    const ipn_id = await registerIPN(token)
    const order_id = `SAGECO-${Date.now()}`
    const orderRes = await axios.post(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      id: order_id,
      currency: 'UGX',
      amount: parseInt(amount),
      description: `Property Viewing Fee - ${date}`,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success?order=${order_id}`,
      notification_id: ipn_id,
      billing_address: {
        email_address: email,
        phone_number: phone,
        first_name: name.split(' ')[0],
        last_name: name.split(' ')[1] || '',
      }
    }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' } })
    return res.json({ redirect_url: orderRes.data.redirect_url, order_tracking_id: orderRes.data.order_tracking_id })
  } catch (err) {
    console.error(err?.response?.data || err.message)
    return res.status(500).json({ error: 'PesaPal error', details: err?.response?.data })
  }
}
