import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  'https://emldbjqegftrngxypeca.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk'
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = req.body

    const { data, error } = await supabaseAdmin.from('properties').insert([{
      ...body,
      status: 'pending'
    }]).select().single()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ property: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
