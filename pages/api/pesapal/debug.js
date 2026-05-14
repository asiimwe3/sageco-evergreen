export default async function handler(req, res) {
  try {
    // Test token fetch
    const tokenRes = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ 
        consumer_key: 'NL6lp3bu17Oyp4ykldKhezVWakIGlF5w', 
        consumer_secret: 'LqCRWimK9fH5HvuVwkzKsDS8Xbc=' 
      })
    })
    const tokenText = await tokenRes.text()
    let tokenData
    try { tokenData = JSON.parse(tokenText) } catch(e) { tokenData = { raw: tokenText.substring(0,300) } }
    
    if (!tokenData.token) {
      return res.status(200).json({ step: 'token_failed', status: tokenRes.status, data: tokenData })
    }

    // Test order submit
    const orderRes = await fetch('https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest', {
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
        callback_url: 'https://sageco-evergreen.vercel.app/broker-payment-success',
        notification_id: 'd1bf4b0e-ab62-4b3e-ad96-da622a516a9d',
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
