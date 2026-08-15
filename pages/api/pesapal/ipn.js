// SageCo Evergreen — PesaPal IPN (proxied to Base44 backend)
const BASE44 = 'https://derick-ai-775511bf.base44.app/functions/sagecoPesapalIPN'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const r = await fetch(BASE44, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    })
    const data = await r.json()
    return res.status(200).json(data)
  } catch (err) {
    console.error('[pesapal/ipn] Base44 proxy error:', err.message)
    return res.status(200).json({ success: false })
  }
}
