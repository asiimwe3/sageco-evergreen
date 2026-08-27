import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { conversation_id, sender_id, sender_role, content } = req.body

  if (!conversation_id || !sender_id || !content?.trim()) {
    return res.status(400).json({ error: 'conversation_id, sender_id, and content are required' })
  }

  try {
    // Insert the message
    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .insert([{
        conversation_id,
        sender_id,
        sender_role,
        content: content.trim(),
        message_type: 'text'
      }])
      .select()
      .single()

    if (error) throw error

    // Update conversation's last_message and unread count
    const { data: conv } = await supabaseAdmin
      .from('chat_conversations')
      .select('broker_id, buyer_id')
      .eq('id', conversation_id)
      .single()

    if (conv) {
      const isBrokerSender = sender_role === 'broker'
      const updateData = {
        last_message: content.trim().slice(0, 200),
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Increment the OTHER person's unread count
      if (isBrokerSender) {
        const { data: current } = await supabaseAdmin
          .from('chat_conversations')
          .select('buyer_unread_count')
          .eq('id', conversation_id)
          .single()
        updateData.buyer_unread_count = (current?.buyer_unread_count || 0) + 1
      } else {
        const { data: current } = await supabaseAdmin
          .from('chat_conversations')
          .select('broker_unread_count')
          .eq('id', conversation_id)
          .single()
        updateData.broker_unread_count = (current?.broker_unread_count || 0) + 1
      }

      await supabaseAdmin
        .from('chat_conversations')
        .update(updateData)
        .eq('id', conversation_id)
    }

    res.status(201).json({ message: data })
  } catch (err) {
    console.error('[chat/send]', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
}
