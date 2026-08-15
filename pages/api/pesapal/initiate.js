// SageCo Evergreen — PesaPal Initiate (proxied to Base44 backend)
const BASE44 = 'https://derick-ai-775511bf.base44.app/functions/sagecoPesapalInitiate'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const r = await fetch(BASE44, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    })
    const data = await r.json()
    return res.status(r.status).json(data)
  } catch (err) {
    console.error('[pesapal/initiate] Base44 proxy error:', err.message)
    return res.status(500).json({ error: 'Payment initiation failed' })
  }
}
