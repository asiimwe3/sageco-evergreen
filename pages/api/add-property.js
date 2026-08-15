// SageCo Evergreen — Add Property (proxied to Base44 backend)
const BASE44 = 'https://derick-ai-775511bf.base44.app/functions/sagecoAddProperty'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.status(200).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const authHeader = req.headers.authorization || ''
    const r = await fetch(BASE44, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(req.body)
    })
    const data = await r.json()
    return res.status(r.status).json(data)
  } catch (err) {
    console.error('[add-property] Base44 proxy error:', err.message)
    return res.status(500).json({ error: 'Failed to add property' })
  }
}
