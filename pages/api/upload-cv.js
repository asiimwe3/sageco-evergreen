import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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
