import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { buyer_id, buyer_name, buyer_email, broker_id, broker_name, broker_email, property_id, property_title } = req.body

  if (!buyer_id || !broker_id) return res.status(400).json({ error: 'buyer_id and broker_id are required' })

  try {
    // Check if conversation already exists
    const { data: existing } = await supabaseAdmin
      .from('chat_conversations')
      .select('*')
      .eq('buyer_id', buyer_id)
      .eq('broker_id', broker_id)
      .single()

    if (existing) {
      return res.status(200).json({ conversation: existing })
    }

    // Create new conversation
    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .insert([{
        buyer_id, buyer_name, buyer_email,
        broker_id, broker_name, broker_email,
        property_id, property_title
      }])
      .select()
      .single()

    if (error) throw error

    // Add a system message
    await supabaseAdmin.from('chat_messages').insert([{
      conversation_id: data.id,
      sender_id: buyer_id,
      sender_role: 'buyer',
      content: property_title
        ? `Conversation started about: ${property_title}`
        : 'Conversation started',
      message_type: 'system'
    }])

    res.status(201).json({ conversation: data })
  } catch (err) {
    console.error('[chat/start]', err)
    res.status(500).json({ error: 'Failed to start conversation' })
  }
}
