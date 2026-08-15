// SageCo Evergreen — Contact API (direct Supabase, no Base44 proxy)
import { supabaseAdmin } from '../../lib/supabaseAdmin.js'
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
