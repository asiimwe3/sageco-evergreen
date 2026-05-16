import pkg from "pg"
const { Client } = pkg

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026"

export default async function handler(req, res) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1]
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!projectRef || !serviceKey) {
    return res.status(500).json({ error: "Missing config" })
  }

  const client = new Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: serviceKey,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()

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
    ]

    const results = []
    for (const sql of migrations) {
      try {
        await client.query(sql)
        results.push({ sql: sql.slice(0, 60), status: "ok" })
      } catch (e) {
        results.push({ sql: sql.slice(0, 60), status: "error", detail: e.message })
      }
    }

    await client.end()
    return res.status(200).json({ success: true, results })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
