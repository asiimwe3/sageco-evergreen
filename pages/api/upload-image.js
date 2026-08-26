// SageCo Evergreen — Upload Image (Supabase Storage, no external proxy)
import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../lib/supabaseAdmin.js'
import { verifyAuth } from '../../lib/company.js'

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Require auth — only logged-in users can upload
  const { user, error: authError } = await verifyAuth(req.headers.authorization, SUPA_URL, SUPA_KEY)
  if (!user) return res.status(401).json({ error: authError || "Authentication required to upload images" })

  const { fileData, fileName, mimeType, bucket = 'property-images' } = req.body
  if (!fileData) return res.status(400).json({ error: 'No file data provided' })

  try {
    const buffer = Buffer.from(fileData, 'base64')

    // Validate size (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Max 5MB.' })
    }

    // Validate mime type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (mimeType && !allowed.includes(mimeType)) {
      return res.status(400).json({ error: 'Only JPEG, PNG, WebP, GIF allowed' })
    }

    const safeName = (fileName || 'upload').replace(/[^a-zA-Z0-9._-]/g, '-')
    const path = `${Date.now()}-${safeName}`

    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, buffer, { contentType: mimeType || 'image/jpeg', upsert: false })

    if (uploadError) throw uploadError

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
    res.status(200).json({ url: urlData.publicUrl, path })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Upload failed' })
  }
}
