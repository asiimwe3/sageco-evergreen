import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://eiyexnuhqdscomilwpqg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc"
)

export const config = { api: { bodyParser: { sizeLimit: "6mb" } } }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { fileName, fileData, mimeType } = req.body
  if (!fileData) return res.status(400).json({ error: "No file data" })

  try {
    const buffer = Buffer.from(fileData, "base64")
    const name = `cv-${Date.now()}-${fileName || "cv.pdf"}`

    const { error } = await supabase.storage
      .from("cvs")
      .upload(name, buffer, {
        contentType: mimeType || "application/pdf",
        upsert: true
      })

    if (error) return res.status(500).json({ error: error.message })

    const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(name)
    return res.status(200).json({ url: urlData.publicUrl })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
