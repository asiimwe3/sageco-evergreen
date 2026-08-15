// Temporary endpoint to set up MLM tables
import { SUPA_URL, SUPA_KEY } from '../../lib/supabaseAdmin.js'

const SQL = `
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

ALTER TABLE agents ADD CONSTRAINT IF NOT EXISTS agents_sponsor_fk FOREIGN KEY (sponsor_id) REFERENCES agents(id);
ALTER TABLE agents ADD CONSTRAINT IF NOT EXISTS agents_upline_fk FOREIGN KEY (upline_id) REFERENCES agents(id);
ALTER TABLE agent_groups ADD CONSTRAINT IF NOT EXISTS agent_groups_owner_fk FOREIGN KEY (owner_agent_id) REFERENCES agents(id);
ALTER TABLE agent_downline ADD CONSTRAINT IF NOT EXISTS ad_agent_fk FOREIGN KEY (agent_id) REFERENCES agents(id);
ALTER TABLE agent_downline ADD CONSTRAINT IF NOT EXISTS ad_downline_fk FOREIGN KEY (downline_agent_id) REFERENCES agents(id);
ALTER TABLE agent_commissions ADD CONSTRAINT IF NOT EXISTS ac_agent_fk FOREIGN KEY (agent_id) REFERENCES agents(id);

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
`

export default async function handler(req, res) {
  if (req.query.secret !== 'setup-mlm-2026') return res.status(403).json({ error: "Forbidden" })
  
  try {
    // Use Supabase's PostgreSQL connection via the service role
    // We'll use the pg module... but we removed it. Let's use a different approach.
    // Actually, let's create the tables by inserting into them
    // PostgREST will auto-create if table exists, but won't create if not.
    
    // Instead, let's use the Supabase Management API
    const projectRef = "emldbjqegftrngxypeca"
    
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SQL }),
    })
    
    const result = await response.text()
    
    if (response.ok) {
      return res.status(200).json({ success: true, message: "MLM tables created", result: result.slice(0, 200) })
    } else {
      return res.status(500).json({ 
        error: "Could not create tables via management API",
        status: response.status,
        detail: result.slice(0, 200)
      })
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
