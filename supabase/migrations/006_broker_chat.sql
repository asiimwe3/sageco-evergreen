-- ============================================================
-- SAGECO EVERGREEN — Broker-Buyer Chat System
-- File: supabase/migrations/006_broker_chat.sql
-- Description: Tables for real-time chat between brokers and buyers
-- ============================================================

-- ── 1. CHAT CONVERSATIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_conversations (
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
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_conversation UNIQUE (broker_id, buyer_id)
);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their conversations" ON chat_conversations;
CREATE POLICY "Users can view their conversations" ON chat_conversations
  FOR SELECT USING (auth.uid() = broker_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Users can insert conversations" ON chat_conversations;
CREATE POLICY "Users can insert conversations" ON chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = broker_id);

DROP POLICY IF EXISTS "Users can update their conversations" ON chat_conversations;
CREATE POLICY "Users can update their conversations" ON chat_conversations
  FOR UPDATE USING (auth.uid() = broker_id OR auth.uid() = buyer_id);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_broker_id ON chat_conversations(broker_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_buyer_id ON chat_conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_msg ON chat_conversations(last_message_at DESC);

-- ── 2. CHAT MESSAGES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  sender_role text NOT NULL CHECK (sender_role IN ('buyer', 'broker')),
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'property_share', 'system')),
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Participants can view messages" ON chat_messages;
CREATE POLICY "Participants can view messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_conversations c
      WHERE c.id = chat_messages.conversation_id
      AND (c.broker_id = auth.uid() OR c.buyer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Participants can insert messages" ON chat_messages;
CREATE POLICY "Participants can insert messages" ON chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_conversations c
      WHERE c.id = chat_messages.conversation_id
      AND (c.broker_id = auth.uid() OR c.buyer_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
