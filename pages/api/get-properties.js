// SageCo Evergreen — Properties API (proxied to Base44 backend)
const BASE44 = 'https://derick-ai-775511bf.base44.app/functions/sagecoGetProperties'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const qs = new URLSearchParams(req.query).toString()
    const r = await fetch(`${BASE44}?${qs}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await r.json()

    // Adapt response shape for frontend compatibility
    return res.status(200).json({
      properties: data.properties || [],
      total: data.total || 0,
      offset: data.offset || 0,
      limit: data.limit || 12,
      hasMore: data.has_more || false,
    })
  } catch (err) {
    console.error('[get-properties] Base44 proxy error:', err.message)
    return res.status(500).json({ error: 'Failed to fetch properties', properties: [], total: 0 })
  }
}
