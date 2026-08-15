import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://eiyexnuhqdscomilwpqg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc"
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  const { id, email, full_name, role } = req.body
  if (!id || !email) return res.status(400).json({ error: "Missing id or email" })

  const { data, error } = await supabase.from("user_profiles").upsert([{
    id, email, full_name: full_name || email.split("@")[0], role: role || "customer"
  }], { onConflict: "id" }).select().single()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ profile: data })
}
