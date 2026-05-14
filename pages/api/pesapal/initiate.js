import axios from 'axios'

const BASE_URL = 'https://pay.pesapal.com/v3'
const CONSUMER_KEY = 'NL6lp3bu17Oyp4ykldKhezVWakIGlF5w'
const CONSUMER_SECRET = 'LqCRWimK9fH5HvuVwkzKsDS8Xbc='
const IPN_ID = 'd1bf4b0e-ab62-4b3e-ad96-da622a516a9d'
const SITE_URL = 'https://sageco-evergreen.vercel.app'

async function getToken() {
  const res = await axios.post(`${BASE_URL}/api/Auth/RequestToken`, {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
  }, { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } })
  return res.data.token
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    amount, currency = 'UGX', description, email, phone,
    first_name, last_name, reference, callback_url
  } = req.body

  // Safety check - PesaPal limit is UGX 30,000
  if (currency === 'UGX' && amount > 30000) {
    return res.status(400).json({ error: 'Amount exceeds maximum allowed (UGX 30,000 per transaction)' })
  }

  try {
    const token = await getToken()
    const callbackUrl = callback_url || `${SITE_URL}/payment-success`

    const orderRes = await axios.post(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      id: reference || `ORDER-${Date.now()}`,
      currency,
      amount,
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
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    return res.status(200).json({
      redirect_url: orderRes.data.redirect_url,
      order_tracking_id: orderRes.data.order_tracking_id
    })
  } catch (err) {
    console.error('PesaPal error:', err.response?.data || err.message)
    return res.status(500).json({
      error: 'Payment initiation failed',
      detail: err.response?.data || err.message
    })
  }
}
