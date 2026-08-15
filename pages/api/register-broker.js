// SageCo Evergreen — Register Broker (direct Supabase, no Base44 proxy)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emldbjqegftrngxypeca.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk'

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { full_name, email, phone, location, specialization, bio, photo_url } = req.body
    if (!full_name || !email || !phone) return res.status(400).json({ error: 'Missing required fields' })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email' })

    const sanitize = (str) => typeof str === 'string' ? str.trim().slice(0, 500) : str

    const { data, error } = await supabaseAdmin.from('brokers').insert([{
      full_name: sanitize(full_name),
      email: sanitize(email),
      phone: sanitize(phone),
      location: sanitize(location),
      specialization: sanitize(specialization),
      bio: sanitize(bio),
      photo_url: photo_url ? sanitize(photo_url) : null,
      registration_status: 'pending',
    }]).select().single()

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Email already registered' })
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json({ success: true, broker: data })
  } catch (err) {
    console.error('[register-broker]', err.message)
    return res.status(500).json({ error: 'Registration failed' })
  }
}
