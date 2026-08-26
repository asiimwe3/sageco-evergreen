// IndexNow API — notifies Bing/Yandex of URL changes for instant indexing
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "sageco-evergreen-indexnow-key"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { urls } = req.body
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'No URLs provided' })
    }

    // Submit to IndexNow
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.map(u => u.startsWith('http') ? u : `${SITE_URL}${u}`),
      }),
    })

    res.status(200).json({
      success: true,
      submitted: urls.length,
      indexnow_status: response.status,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
