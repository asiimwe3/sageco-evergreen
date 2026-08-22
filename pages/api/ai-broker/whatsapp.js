import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" })

  const { from, From, body, Body, message } = req.body
  const sender = from || From || null
  const text = body || Body || message || ""

  if (!text) return res.status(400).json({ error: "No message body" })

  // Forward to the chat logic
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sageco-evergreen-co.vercel.app'
    const chatRes = await fetch(`${baseUrl}/api/ai-broker/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        user_phone: sender,
      })
    })
    const chatData = await chatRes.json()

    res.status(200).json({
      reply: chatData.reply,
      from: sender,
      intent: chatData.intent,
      lead_captured: chatData.lead_captured
    })
  } catch (err) {
    res.status(200).json({
      reply: "I'm having trouble processing your request right now. Please WhatsApp us at 0750 414 366.",
      from: sender
    })
  }
}
