// SageCo Evergreen — Contact API (direct Supabase, no Base44 proxy)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eiyexnuhqdscomilwpqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeWV4bnVocWRzY29taWx3cHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA5NDI3MywiZXhwIjoyMDk1NjcwMjczfQ.d8hxdHNZxpF9tCZaI-jb_69CfbqGYgdZLRdkTMPD4kc'

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email address' })

  const sanitize = (str) => typeof str === 'string' ? str.trim().slice(0, 2000) : ''

  try {
    const { error } = await supabaseAdmin.from('contact_messages').insert([{
      name: sanitize(name), email: sanitize(email), message: sanitize(message)
    }])
    if (error) return res.status(500).json({ error: 'Could not save your message' })
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
