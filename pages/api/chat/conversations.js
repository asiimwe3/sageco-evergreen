import { supabaseAdmin } from '../../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { user_id, role } = req.query

  if (!user_id) return res.status(400).json({ error: 'user_id is required' })

  try {
    let query = supabaseAdmin
      .from('chat_conversations')
      .select('*')
      .order('last_message_at', { ascending: false })

    if (role === 'broker') {
      query = query.eq('broker_id', user_id)
    } else if (role === 'buyer') {
      query = query.eq('buyer_id', user_id)
    } else {
      // Show all conversations where user is either buyer or broker
      query = query.or(`buyer_id.eq.${user_id},broker_id.eq.${user_id}`)
    }

    const { data: conversations, error } = await query

    if (error) throw error

    res.status(200).json({ conversations })
  } catch (err) {
    console.error('[chat/conversations]', err)
    res.status(500).json({ error: 'Failed to fetch conversations' })
  }
}
