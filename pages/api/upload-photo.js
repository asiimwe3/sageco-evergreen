import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = { api: { bodyParser: { sizeLimit: "5mb" } } }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { fileData, fileName, mimeType } = req.body
  if (!fileData) return res.status(400).json({ error: "No file data" })

  try {
    const buffer = Buffer.from(fileData, "base64")
    const ext = (fileName || "photo.jpg").split(".").pop()
    const name = `broker-photo-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from("broker-photos")
      .upload(name, buffer, {
        contentType: mimeType || "image/jpeg",
        upsert: true
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
