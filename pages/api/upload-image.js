// SageCo Evergreen — Upload Image (Supabase Storage, no external proxy)
import { supabaseAdmin } from '../../lib/supabaseAdmin.js'

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { fileData, fileName, mimeType, bucket = 'property-images' } = req.body
  if (!fileData) return res.status(400).json({ error: 'No file data provided' })

  try {
    const buffer = Buffer.from(fileData, 'base64')

    // Validate size (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image too large. Please upload an image under 5MB.' })
    }

    const ext = (fileName || 'image.jpg').split('.').pop().toLowerCase()
    const name = `property-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(name, buffer, {
        contentType: mimeType || 'image/jpeg',
        upsert: false,
        cacheControl: '31536000'
      })

    if (error) {
      console.error('[upload-image] Supabase Storage error:', error.message)
      return res.status(500).json({ error: `Upload failed: ${error.message}` })
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(name)
    return res.status(200).json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('[upload-image] Error:', err.message)
    return res.status(500).json({ error: 'Image upload failed' })
  }
}
