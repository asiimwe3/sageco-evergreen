// SAGECO EVERGREEN — Setup chat tables
import { Client } from 'pg'

export default async function handler(req, res) {
  if ((req.query.secret || req.body?.secret) !== "setup-chat-2026") {
    return res.status(403).json({ error: "Forbidden" })
  }

  const projectRef = "emldbjqegftrngxypeca"
  const jwt = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  try {
    const connections = [
      `postgresql://postgres:${jwt}@db.${projectRef}.supabase.co:5432/postgres`,
      `postgresql://postgres.${projectRef}:${jwt}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
    ]

    let client = null
    let connError = null
    const results = []

    for (const connStr of connections) {
      try {
        client = new Client({
          connectionString: connStr,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 10000
        })
        await client.connect()
        results.push("Connected with: " + connStr.split("@")[1])
        break
      } catch (e) {
        connError = e
        results.push("Failed: " + connStr.split("@")[1] + " -> " + e.message)
        client = null
      }
    }

    if (!client) {
      return res.status(500).json({ error: "All connections failed", results, lastError: connError?.message })
    }

    const sqls = [
      `CREATE TABLE IF NOT EXISTS chat_conversations (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        broker_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
        buyer_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
        property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
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
      )`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS broker_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES properties(id) ON DELETE SET NULL`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS broker_name text`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS buyer_name text`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS broker_email text`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS buyer_email text`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS property_title text`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS last_message text`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS last_message_at timestamptz DEFAULT now()`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS broker_unread_count integer DEFAULT 0`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS buyer_unread_count integer DEFAULT 0`,
      `ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'`,
      // Add unique constraint only if it doesn't exist
      `DO $$ BEGIN
        ALTER TABLE chat_conversations ADD CONSTRAINT unique_conversation UNIQUE (broker_id, buyer_id);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$`,
      `ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY`,
      `DROP POLICY IF EXISTS "Users can view their conversations" ON chat_conversations`,
      `CREATE POLICY "Users can view their conversations" ON chat_conversations FOR SELECT USING (auth.uid() = broker_id OR auth.uid() = buyer_id)`,
      `DROP POLICY IF EXISTS "Users can insert conversations" ON chat_conversations`,
      `CREATE POLICY "Users can insert conversations" ON chat_conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = broker_id)`,
      `DROP POLICY IF EXISTS "Users can update their conversations" ON chat_conversations`,
      `CREATE POLICY "Users can update their conversations" ON chat_conversations FOR UPDATE USING (auth.uid() = broker_id OR auth.uid() = buyer_id)`,
      `CREATE INDEX IF NOT EXISTS idx_chat_conversations_broker_id ON chat_conversations(broker_id)`,
      `CREATE INDEX IF NOT EXISTS idx_chat_conversations_buyer_id ON chat_conversations(buyer_id)`,
      `CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_msg ON chat_conversations(last_message_at DESC)`,
      // Messages table
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
        sender_id uuid NOT NULL,
        sender_role text NOT NULL CHECK (sender_role IN ('buyer', 'broker')),
        content text NOT NULL,
        message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'property_share', 'system')),
        read_at timestamptz,
        created_at timestamptz DEFAULT now()
      )`,
      `ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY`,
      `DROP POLICY IF EXISTS "Participants can view messages" ON chat_messages`,
      `CREATE POLICY "Participants can view messages" ON chat_messages FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM chat_conversations c
          WHERE c.id = chat_messages.conversation_id
          AND (c.broker_id = auth.uid() OR c.buyer_id = auth.uid())
        )
      )`,
      `DROP POLICY IF EXISTS "Participants can insert messages" ON chat_messages`,
      `CREATE POLICY "Participants can insert messages" ON chat_messages FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM chat_conversations c
          WHERE c.id = chat_messages.conversation_id
          AND (c.broker_id = auth.uid() OR c.buyer_id = auth.uid())
        )
      )`,
      `CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id)`,
      `CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id)`,
    ]

    for (const sql of sqls) {
      try {
        await client.query(sql)
        results.push("OK: " + sql.substring(0, 60).replace(/\n/g, ' '))
      } catch (e) {
        results.push("SKIP: " + e.message.substring(0, 80))
      }
    }

    const check = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'chat%'")
    results.push("Tables: " + check.rows.map(r => r.table_name).join(", "))

    await client.end()
    return res.status(200).json({ success: true, results })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
