import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { conversation_id, user_id, user_role } = req.query

  if (!conversation_id) return res.status(400).json({ error: 'conversation_id is required' })

  try {
    // Fetch messages
    const { data: messages, error } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })
      .limit(200)

    if (error) throw error

    // Mark messages from the other person as read
    if (user_id && user_role) {
      const otherRole = user_role === 'broker' ? 'buyer' : 'broker'
      await supabaseAdmin
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversation_id)
        .eq('sender_role', otherRole)
        .is('read_at', null)

      // Reset unread count for this user
      const unreadField = user_role === 'broker' ? 'broker_unread_count' : 'buyer_unread_count'
      await supabaseAdmin
        .from('chat_conversations')
        .update({ [unreadField]: 0 })
        .eq('id', conversation_id)
    }

    res.status(200).json({ messages })
  } catch (err) {
    console.error('[chat/messages]', err)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}
