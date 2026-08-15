import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://eiyexnuhqdscomilwpqg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc"
)

export const config = { api: { bodyParser: { sizeLimit: "5mb" } } }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { fileData, fileName, mimeType } = req.body
  if (!fileData) return res.status(400).json({ error: "No file data" })

  try {
    const buffer = Buffer.from(fileData, "base64")
    if (buffer.length > 1024 * 1024) {
      return res.status(413).json({ error: "Photo is too large. Please upload a photo under 1MB." })
    }
    const ext = (fileName || "photo.jpg").split(".").pop()
    const name = `broker-photo-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from("broker-photos")
      .upload(name, buffer, {
        contentType: mimeType || "image/jpeg",
        upsert: true,
        cacheControl: "31536000"
      })

    if (error) {
      // If bucket doesn't exist, return null gracefully — photo is optional
      console.error("Photo upload error:", error.message)
      return res.status(200).json({ url: null, warning: error.message })
    }

    const { data: urlData } = supabase.storage.from("broker-photos").getPublicUrl(name)
    return res.status(200).json({ url: urlData.publicUrl })
  } catch (err) {
    console.error("Upload error:", err.message)
    return res.status(200).json({ url: null, warning: err.message })
  }
}
