-- ============================================================
-- SAGECO EVERGREEN — Migration 007: Missing Tables Health Fix
-- Date: 2026-09-03
-- Description: Creates tables referenced by code but missing from the
-- live database. All statements are idempotent (safe to re-run).
--   1. Agent/MLM system (agents, groups, downline, commissions)
--   2. PesaPal payment flow (transactions, ledger_entries)
--   3. Broker-buyer chat (chat_conversations, chat_messages)
-- ============================================================

-- ── 1. AGENT / MLM SYSTEM ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  location TEXT,
  sponsor_id UUID,
  upline_id UUID,
  level INTEGER DEFAULT 1,
  group_id UUID,
  group_name TEXT,
  registration_status TEXT DEFAULT 'pending',
  registration_paid BOOLEAN DEFAULT FALSE,
  registration_fee INTEGER DEFAULT 30000,
  registration_ref TEXT,
  total_earnings NUMERIC DEFAULT 0,
  total_commissions NUMERIC DEFAULT 0,
  downline_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_agent_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  total_group_earnings NUMERIC DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_downline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  downline_agent_id UUID NOT NULL,
  level INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  source_agent_id UUID,
  source_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  level INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  reference_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

DO $$ BEGIN
  ALTER TABLE agents ADD CONSTRAINT agents_sponsor_fk FOREIGN KEY (sponsor_id) REFERENCES agents(id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE agents ADD CONSTRAINT agents_upline_fk FOREIGN KEY (upline_id) REFERENCES agents(id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE agent_groups ADD CONSTRAINT agent_groups_owner_fk FOREIGN KEY (owner_agent_id) REFERENCES agents(id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE agent_downline ADD CONSTRAINT ad_agent_fk FOREIGN KEY (agent_id) REFERENCES agents(id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE agent_downline ADD CONSTRAINT ad_downline_fk FOREIGN KEY (downline_agent_id) REFERENCES agents(id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE agent_commissions ADD CONSTRAINT ac_agent_fk FOREIGN KEY (agent_id) REFERENCES agents(id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE brokers ADD COLUMN IF NOT EXISTS sponsor_agent_id UUID;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS group_id UUID;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS mlm_level INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_agents_sponsor ON agents(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_agents_group ON agents(group_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(registration_status);
CREATE INDEX IF NOT EXISTS idx_downline_agent ON agent_downline(agent_id);
CREATE INDEX IF NOT EXISTS idx_downline_downline ON agent_downline(downline_agent_id);
CREATE INDEX IF NOT EXISTS idx_commissions_agent ON agent_commissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON agent_commissions(status);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_downline ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_commissions ENABLE ROW LEVEL SECURITY;

-- ── 2. PESAPAL TRANSACTIONS & LEDGER ─────────────────────────────────

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'UGX',
  customer_email TEXT,
  customer_phone TEXT,
  customer_name TEXT,
  description TEXT,
  broker_id UUID,
  property_id UUID,
  pesapal_order_tracking_id TEXT,
  pesapal_payment_status TEXT,
  pesapal_payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  account TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('debit', 'credit')),
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_broker ON transactions(broker_id);
CREATE INDEX IF NOT EXISTS idx_ledger_transaction ON ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_account ON ledger_entries(account);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

-- ── 3. BROKER-BUYER CHAT (migration 006 — never applied to live DB) ────

CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their conversations" ON chat_conversations;
CREATE POLICY "Users can view their conversations" ON chat_conversations
  FOR SELECT USING (auth.uid() = broker_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Users can insert conversations" ON chat_conversations;
CREATE POLICY "Users can insert conversations" ON chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = broker_id);

DROP POLICY IF EXISTS "Users can update their conversations" ON chat_conversations;
CREATE POLICY "Users can update their conversations" ON chat_conversations
  FOR UPDATE USING (auth.uid() = broker_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Participants can view messages" ON chat_messages;
CREATE POLICY "Participants can view messages" ON chat_messages
  FOR SELECT USING (
    auth.uid() = sender_id
    OR EXISTS (
      SELECT 1 FROM chat_conversations c
      WHERE c.id = conversation_id AND (auth.uid() = c.broker_id OR auth.uid() = c.buyer_id)
    )
  );

DROP POLICY IF EXISTS "Participants can send messages" ON chat_messages;
CREATE POLICY "Participants can send messages" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    OR EXISTS (
      SELECT 1 FROM chat_conversations c
      WHERE c.id = conversation_id AND (auth.uid() = c.broker_id OR auth.uid() = c.buyer_id)
    )
  );

DROP POLICY IF EXISTS "Participants can update messages" ON chat_messages;
CREATE POLICY "Participants can update messages" ON chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_conversations c
      WHERE c.id = conversation_id AND (auth.uid() = c.broker_id OR auth.uid() = c.buyer_id)
    )
  );
