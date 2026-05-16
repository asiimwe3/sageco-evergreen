import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()

  const migrations = [
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS sub_type TEXT`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_level TEXT`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS land_acres NUMERIC`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_feet TEXT`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS water_available TEXT`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS electricity_available TEXT`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS road_distance_km NUMERIC`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS fence TEXT`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_deed TEXT`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_negotiable BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_name TEXT`,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_phone TEXT`,
    `ALTER TABLE brokers ADD COLUMN IF NOT EXISTS broker_id TEXT`,
    `ALTER TABLE brokers ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ`,
  ]

  const results = []
  for (const sql of migrations) {
    const { error } = await supabase.rpc("run_sql", { sql })
    results.push({ sql: sql.slice(0, 60), error: error?.message || "ok" })
  }

  return res.status(200).json({ results })
}
