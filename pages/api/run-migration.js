// SageCo Evergreen — Migration API (uses Supabase REST, no pg dependency)
import { SUPA_URL, SUPA_KEY } from '../../lib/supabaseAdmin.js'

const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_MIGRATIONS) {
    return res.status(403).json({ error: "Disabled in production" })
  }
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) return res.status(403).end()

  try {
    // Use Supabase REST API to run migration via RPC
    // Since we can't run raw SQL via REST, we use the management API
    const response = await fetch(`${SUPA_URL}/rest/v1/rpc/run_migration`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      // Fallback: report that migrations need to be run manually via Supabase dashboard
      return res.status(200).json({
        message: "Migrations should be run via Supabase Dashboard SQL Editor",
        migrations: [
          "ALTER TABLE properties ADD COLUMN IF NOT EXISTS sub_type TEXT",
          "ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_level TEXT",
          "ALTER TABLE properties ADD COLUMN IF NOT EXISTS land_acres NUMERIC",
          "ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_feet TEXT",
          "ALTER TABLE properties ADD COLUMN IF NOT EXISTS water_available TEXT",
          "ALTER TABLE properties ADD COLUMN IF NOT EXISTS electricity_available TEXT",
          "ALTER TABLE properties ADD COLUMN IF NOT EXISTS road_distance_km NUMERIC",
        ],
      })
    }

    const data = await response.json()
    return res.status(200).json({ success: true, data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
