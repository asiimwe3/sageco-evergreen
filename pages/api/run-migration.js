import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

// We'll use Supabase's ability to insert into information_schema to check columns
// then use a workaround: insert a dummy record with the new field and catch the error

async function columnExists(table, column) {
  const { data } = await supabase
    .from("information_schema.columns")
    .select("column_name")
    .eq("table_name", table)
    .eq("column_name", column)
    .eq("table_schema", "public")
  return data && data.length > 0
}

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()

  // Use Supabase's pg REST endpoint to run raw SQL
  const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

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
    // Use Supabase's pg endpoint
    const r = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: sql })
    })
    const d = await r.json()
    results.push({ sql: sql.slice(0, 60), status: r.ok ? "ok" : "error", detail: d?.message || "done" })
  }

  return res.status(200).json({ results })
}
