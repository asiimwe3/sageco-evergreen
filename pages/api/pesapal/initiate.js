const BASE_URL = 'https://pay.pesapal.com/v3'
const CONSUMER_KEY = 'NL6lp3bu17Oyp4ykldKhezVWakIGlF5w'
const CONSUMER_SECRET = 'LqCRWimK9fH5HvuVwkzKsDS8Xbc='
const IPN_ID = 'd1bf4b0e-ab62-4b3e-ad96-da622a516a9d'
const SITE_URL = 'https://sageco-evergreen.vercel.app'

async function getToken() {
  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch(e) { throw new Error('Token parse error: ' + text.substring(0,200)) }
  if (!data.token) throw new Error('No token: ' + JSON.stringify(data))
  return data.token
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    amount, currency = 'UGX', description, email, phone,
    first_name, last_name, reference, callback_url
  } = req.body

  try {
    const token = await getToken()
    const callbackUrl = callback_url || `${SITE_URL}/payment-success`

    const orderRes = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
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
      })
    })

    const rawText = await orderRes.text()
    let orderData
    try { orderData = JSON.parse(rawText) } catch(e) {
      return res.status(500).json({ error: 'PesaPal non-JSON response', detail: rawText.substring(0, 300) })
    }

    if (orderData.error) {
      return res.status(400).json({ error: orderData.error?.message || 'PesaPal error', detail: orderData.error })
    }

    if (!orderData.redirect_url) {
      return res.status(500).json({ error: 'No redirect URL', detail: orderData })
    }

    return res.status(200).json({
      redirect_url: orderData.redirect_url,
      order_tracking_id: orderData.order_tracking_id
    })
  } catch (err) {
    console.error('PesaPal error:', err.message)
    return res.status(500).json({ error: 'Payment initiation failed', detail: err.message })
  }
}
