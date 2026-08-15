import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://emldbjqegftrngxypeca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk"
)

const MIGRATION_SECRET = process.env.MIGRATION_SECRET

const SQL_STATEMENTS = [
  // Officers table
  `CREATE TABLE IF NOT EXISTS officers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    photo_url text,
    role text DEFAULT 'officer',
    department text,
    bio text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now()
  )`,

  // Bookings table
  `CREATE TABLE IF NOT EXISTS bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reference text UNIQUE,
    property_id uuid,
    property_title text,
    broker_id uuid,
    broker_name text,
    officer_id uuid,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    preferred_date date,
    message text,
    total_amount integer DEFAULT 30000,
    business_share integer,
    broker_share integer DEFAULT 0,
    payment_type text,
    status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now()
  )`,

  // Job applications table
  `CREATE TABLE IF NOT EXISTS job_applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id text,
    job_title text,
    department text,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    experience text,
    cover_letter text,
    cv_url text,
    status text DEFAULT 'received',
    notes text,
    created_at timestamptz DEFAULT now()
  )`,

  // Contact messages table
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'unread',
    created_at timestamptz DEFAULT now()
  )`,

  // Add broker_name to properties if missing
  `ALTER TABLE properties ADD COLUMN IF NOT EXISTS broker_name text`,
  `ALTER TABLE properties ADD COLUMN IF NOT EXISTS officer_id uuid`,

  // Add plan columns to brokers if missing
  `ALTER TABLE brokers ADD COLUMN IF NOT EXISTS plan text DEFAULT 'basic'`,
  `ALTER TABLE brokers ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz`,
  `ALTER TABLE brokers ADD COLUMN IF NOT EXISTS notes text`,
]

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  // Block entirely in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_MIGRATIONS) {
    return res.status(403).json({ error: "Migration routes are disabled in production" })
  }
  if (req.headers["x-migration-secret"] !== MIGRATION_SECRET) {
    return res.status(403).json({ error: "Forbidden" })
  }

  const results = []
  for (const sql of SQL_STATEMENTS) {
    try {
      const { error } = await supabase.rpc("run_sql", { query: sql }).single()
      if (error && !error.message.includes("already exists")) {
        results.push({ sql: sql.slice(0, 60), error: error.message })
      } else {
        results.push({ sql: sql.slice(0, 60), ok: true })
      }
    } catch (e) {
      results.push({ sql: sql.slice(0, 60), error: e.message })
    }
  }

  return res.status(200).json({ results })
}
