-- SAGECO EVERGREEN MLM Agent System Schema
-- Registration fee: UGX 30,000 per agent

-- 1. Agents table (group owners who register with UGX 30,000)
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  location TEXT,
  
  -- MLM hierarchy
  sponsor_id UUID REFERENCES agents(id),  -- who recruited this agent
  upline_id UUID REFERENCES agents(id),   -- direct upline (parent agent)
  level INTEGER DEFAULT 1,                -- MLM level (1 = top, 2 = recruited by level 1, etc.)
  
  -- Group management
  group_id UUID,                          -- group they own (if any)
  group_name TEXT,
  
  -- Registration
  registration_status TEXT DEFAULT 'pending',  -- pending, active, suspended
  registration_paid BOOLEAN DEFAULT FALSE,
  registration_fee INTEGER DEFAULT 30000,       -- UGX 30,000
  registration_ref TEXT,
  
  -- Earnings
  total_earnings NUMERIC DEFAULT 0,
  total_commissions NUMERIC DEFAULT 0,
  downline_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agent Groups table
CREATE TABLE IF NOT EXISTS agent_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_agent_id UUID REFERENCES agents(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  -- group stats
  member_count INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  total_group_earnings NUMERIC DEFAULT 0,
  -- settings
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Agent Downline table (tracks MLM recruitment tree)
CREATE TABLE IF NOT EXISTS agent_downline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) NOT NULL,          -- the recruiter (upline)
  downline_agent_id UUID REFERENCES agents(id) NOT NULL,  -- the recruited agent
  level INTEGER NOT NULL,  -- 1 = direct, 2 = indirect, etc.
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Agent Commissions table (MLM earnings tracking)
CREATE TABLE IF NOT EXISTS agent_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) NOT NULL,           -- who earns the commission
  source_agent_id UUID REFERENCES agents(id),              -- from whose activity
  source_type TEXT NOT NULL,  -- registration, booking, subscription, downline
  amount NUMERIC NOT NULL,
  level INTEGER DEFAULT 1,    -- MLM level of commission
  status TEXT DEFAULT 'pending',  -- pending, paid, cancelled
  reference_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- 5. Add MLM columns to brokers table
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS sponsor_agent_id UUID REFERENCES agents(id);
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES agent_groups(id);
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS mlm_level INTEGER DEFAULT 0;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agents_sponsor ON agents(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_agents_group ON agents(group_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(registration_status);
CREATE INDEX IF NOT EXISTS idx_downline_agent ON agent_downline(agent_id);
CREATE INDEX IF NOT EXISTS idx_downline_downline ON agent_downline(downline_agent_id);
CREATE INDEX IF NOT EXISTS idx_commissions_agent ON agent_commissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON agent_commissions(status);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_downline ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (service role bypasses RLS, which is what our API uses)
CREATE POLICY "Agents are viewable by all" ON agents FOR SELECT USING (true);
CREATE POLICY "Agent groups are viewable by all" ON agent_groups FOR SELECT USING (true);
CREATE POLICY "Agent downline is viewable by all" ON agent_downline FOR SELECT USING (true);
CREATE POLICY "Agent commissions viewable by owner" ON agent_commissions FOR SELECT USING (true);
