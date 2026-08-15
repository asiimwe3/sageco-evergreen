import pkg from "pg"
const { Client } = pkg

const client = new Client({
  connectionString: "postgresql://postgres.emldbjqegftrngxypeca:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk@aws-0-eu-west-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
})

async function run() {
  try {
    await client.connect()
    console.log("Connected to Supabase PostgreSQL")

    await client.query(`CREATE TABLE IF NOT EXISTS agents (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id TEXT, full_name TEXT NOT NULL, email TEXT, phone TEXT NOT NULL, photo_url TEXT, bio TEXT, location TEXT, sponsor_id UUID, upline_id UUID, level INTEGER DEFAULT 1, group_id UUID, group_name TEXT, registration_status TEXT DEFAULT 'pending', registration_paid BOOLEAN DEFAULT FALSE, registration_fee INTEGER DEFAULT 30000, registration_ref TEXT, total_earnings NUMERIC DEFAULT 0, total_commissions NUMERIC DEFAULT 0, downline_count INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`)
    console.log("agents table created")

    await client.query(`CREATE TABLE IF NOT EXISTS agent_groups (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_agent_id UUID NOT NULL, name TEXT NOT NULL, description TEXT, member_count INTEGER DEFAULT 0, active_members INTEGER DEFAULT 0, total_group_earnings NUMERIC DEFAULT 0, is_public BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`)
    console.log("agent_groups table created")

    await client.query(`CREATE TABLE IF NOT EXISTS agent_downline (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), agent_id UUID NOT NULL, downline_agent_id UUID NOT NULL, level INTEGER NOT NULL, status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW())`)
    console.log("agent_downline table created")

    await client.query(`CREATE TABLE IF NOT EXISTS agent_commissions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), agent_id UUID NOT NULL, source_agent_id UUID, source_type TEXT NOT NULL, amount NUMERIC NOT NULL, level INTEGER DEFAULT 1, status TEXT DEFAULT 'pending', reference_id TEXT, description TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), paid_at TIMESTAMPTZ)`)
    console.log("agent_commissions table created")

    await client.query(`ALTER TABLE brokers ADD COLUMN IF NOT EXISTS sponsor_agent_id UUID`)
    await client.query(`ALTER TABLE brokers ADD COLUMN IF NOT EXISTS group_id UUID`)
    await client.query(`ALTER TABLE brokers ADD COLUMN IF NOT EXISTS mlm_level INTEGER DEFAULT 0`)
    console.log("brokers table updated with MLM columns")

    await client.query(`CREATE INDEX IF NOT EXISTS idx_agents_sponsor ON agents(sponsor_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_agents_group ON agents(group_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(registration_status)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_downline_agent ON agent_downline(agent_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_downline_downline ON agent_downline(downline_agent_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_commissions_agent ON agent_commissions(agent_id)`)
    console.log("indexes created")

    await client.query(`ALTER TABLE agents ENABLE ROW LEVEL SECURITY`)
    await client.query(`ALTER TABLE agent_groups ENABLE ROW LEVEL SECURITY`)
    await client.query(`ALTER TABLE agent_downline ENABLE ROW LEVEL SECURITY`)
    await client.query(`ALTER TABLE agent_commissions ENABLE ROW LEVEL SECURITY`)
    console.log("RLS enabled")

    await client.query(`CREATE POLICY IF NOT EXISTS "agents_select_all" ON agents FOR SELECT USING (true)`)
    await client.query(`CREATE POLICY IF NOT EXISTS "agent_groups_select_all" ON agent_groups FOR SELECT USING (true)`)
    await client.query(`CREATE POLICY IF NOT EXISTS "agent_downline_select_all" ON agent_downline FOR SELECT USING (true)`)
    await client.query(`CREATE POLICY IF NOT EXISTS "agent_commissions_select_all" ON agent_commissions FOR SELECT USING (true)`)
    console.log("RLS policies created")

    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'agent%'")
    console.log("MLM tables:", res.rows.map(r => r.table_name))

  } catch (err) {
    console.error("Error:", err.message)
  } finally {
    await client.end()
  }
}

run()
