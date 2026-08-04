const BASE_URL = process.env.PESAPAL_ENV === 'sandbox' 
  ? 'https://cybqa.pesapal.com/v3' 
  : 'https://pay.pesapal.com/v3'

export default async function handler(req, res) {
  const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY
  const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET
  const IPN_ID = process.env.PESAPAL_IPN_ID
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sageco-evergreen-co.vercel.app'

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return res.status(200).json({ step: 'config', error: 'PesaPal credentials not set in env vars' })
  }

  try {
    const tokenRes = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
    })
    const tokenText = await tokenRes.text()
    let tokenData
    try { tokenData = JSON.parse(tokenText) } catch(e) { tokenData = { raw: tokenText.substring(0,300) } }
    
    if (!tokenData.token) {
      return res.status(200).json({ step: 'token_failed', status: tokenRes.status, data: tokenData })
    }

    const orderRes = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        id: `DEBUG-${Date.now()}`,
        currency: 'UGX',
        amount: 20000,
        description: 'Debug test',
        callback_url: `${SITE_URL}/broker-payment-success`,
        notification_id: IPN_ID,
        billing_address: { email_address: 'test@sageco.co', phone_number: '+256700000000', first_name: 'Test', last_name: 'User', country_code: 'UG' }
      })
    })
    const orderText = await orderRes.text()
    let orderData
    try { orderData = JSON.parse(orderText) } catch(e) { orderData = { raw: orderText.substring(0,500) } }

    return res.status(200).json({ step: 'order', http_status: orderRes.status, data: orderData })
  } catch(err) {
    return res.status(200).json({ step: 'catch', error: err.message })
  }
}
