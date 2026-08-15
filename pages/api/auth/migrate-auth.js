import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://emldbjqegftrngxypeca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbGRianFlZ2Z0cm5neHlwZWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyNDM1MiwiZXhwIjoyMDkzOTAwMzUyfQ.qxKXCKisdivaO-x1nrGcnpmQL8K5Fcs2l69LizuAyLk"
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  if (req.headers["x-admin-secret"] !== (process.env.NEXT_PUBLIC_ADMIN_SECRET || "sageco-admin-2026")) {
    return res.status(403).end()
  }

  // We create the user_profiles table by running raw SQL using pg.query via Supabase
  // Since we can't run DDL directly, we use a workaround:
  // Attempt to insert a dummy row — if table doesn't exist, return the SQL to run manually
  const testInsert = await supabase.from("user_profiles").select("id").limit(1)

  if (testInsert.error?.code === "42P01") {
    // Table doesn't exist — return migration SQL for manual run
    return res.status(200).json({
      status: "table_missing",
      message: "Run this SQL in your Supabase SQL editor",
      sql: `
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role full access" ON public.user_profiles USING (true);
      `.trim()
    })
  }

  return res.status(200).json({ status: "ok", message: "user_profiles table already exists" })
}
