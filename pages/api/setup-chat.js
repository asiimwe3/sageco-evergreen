// SAGECO EVERGREEN — Setup chat tables via Supabase REST API
import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../lib/supabaseAdmin.js'

export default async function handler(req, res) {
  if ((req.query.secret || req.body?.secret) !== "setup-chat-2026") {
    return res.status(403).json({ error: "Forbidden" })
  }

  const results = []

  try {
    // Try using the Supabase REST API to create tables via RPC
    // First check if a custom exec_sql function exists
    const checkRes = await fetch(`${SUPA_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql_text: 'SELECT 1 as test' })
    })

    if (checkRes.ok) {
      results.push("exec_sql function exists!")
      const checkData = await checkRes.json()
      results.push("Test result: " + JSON.stringify(checkData))
      
      // Run the chat table creation SQL
      const sql = `
        CREATE TABLE IF NOT EXISTS chat_conversations (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          broker_id uuid,
          buyer_id uuid,
          property_id uuid,
          broker_name text,
          buyer_name text,
          broker_email text,
          buyer_email text,
          property_title text,
          last_message text,
          last_message_at timestamptz DEFAULT now(),
          broker_unread_count integer DEFAULT 0,
          buyer_unread_count integer DEFAULT 0,
          status text DEFAULT 'active',
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS chat_messages (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          conversation_id uuid,
          sender_id uuid NOT NULL,
          sender_role text NOT NULL,
          content text NOT NULL,
          message_type text DEFAULT 'text',
          read_at timestamptz,
          created_at timestamptz DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_broker_id ON chat_conversations(broker_id);
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_buyer_id ON chat_conversations(buyer_id);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
      `
      
      const createRes = await fetch(`${SUPA_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql_text: sql })
      })
      
      if (createRes.ok) {
        results.push("Chat tables created via exec_sql!")
      } else {
        const errText = await createRes.text()
        results.push("exec_sql failed: " + errText.substring(0, 200))
      }
    } else {
      results.push("exec_sql function not found, trying alternative approach...")
      
      // Try using the Supabase JS client to check if tables exist
      const { data: testConv, error: convErr } = await supabaseAdmin
        .from('chat_conversations')
        .select('id')
        .limit(1)
      
      if (convErr) {
        results.push("chat_conversations table error: " + convErr.message)
        
        // Try inserting to create the table (won't work for DDL, but let's try)
        // Actually, try using the Supabase Management API
        const mgmtRes = await fetch(`https://api.supabase.com/v1/projects/emldbjqegftrngxypeca/database/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPA_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: 'SELECT 1 as test' })
        })
        
        if (mgmtRes.ok) {
          results.push("Management API works!")
          const mgmtData = await mgmtRes.json()
          results.push("Test: " + JSON.stringify(mgmtData))
        } else {
          const mgmtErr = await mgmtRes.text()
          results.push("Management API failed: " + mgmtErr.substring(0, 200))
        }
      } else {
        results.push("chat_conversations table already exists!")
      }
      
      const { data: testMsg, error: msgErr } = await supabaseAdmin
        .from('chat_messages')
        .select('id')
        .limit(1)
      
      if (msgErr) {
        results.push("chat_messages table error: " + msgErr.message)
      } else {
        results.push("chat_messages table already exists!")
      }
    }

    return res.status(200).json({ success: true, results })
  } catch (err) {
    return res.status(500).json({ error: err.message, results })
  }
}
