import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { imageBase64, fileName, bucket = 'property-images' } = req.body
    if (!imageBase64 || !fileName) return res.status(400).json({ error: 'Missing imageBase64 or fileName' })

    // Decode base64
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    if (buffer.length > 3 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image is too large. Please upload an image under 3MB.' })
    }

    // Detect mime type
    const ext = fileName.split('.').pop().toLowerCase()
    const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
    if (!mimeMap[ext]) {
      return res.status(400).json({ error: 'Unsupported image type' })
    }
    const contentType = mimeMap[ext]

    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(uniqueName, buffer, { contentType, upsert: true, cacheControl: '31536000' })

    if (error) return res.status(500).json({ error: error.message })

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uniqueName)
    return res.status(200).json({ url: urlData.publicUrl })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
