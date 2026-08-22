import { supabaseAdmin, SUPA_URL, SUPA_KEY } from '../../lib/supabaseAdmin.js'
import { Client } from 'pg'

const SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS property_verifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  verification_type text CHECK (verification_type IN ('drone', 'lidar', 'ground')),
  boundary_geojson jsonb,
  drone_images text[] DEFAULT '{}',
  "3d_model_url" text,
  gps_coordinates text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed')),
  verified_by text,
  verified_at timestamptz,
  report_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE property_verifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage property_verifications" ON property_verifications;
CREATE POLICY "Service role can manage property_verifications" ON property_verifications FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_property_verifications_property_id ON property_verifications(property_id);

CREATE TABLE IF NOT EXISTS fraud_flags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  flag_type text CHECK (flag_type IN ('duplicate_listing', 'boundary_conflict', 'document_inconsistency', 'suspicious_pricing')),
  severity text CHECK (severity IN ('low', 'medium', 'high')),
  description text,
  auto_detected boolean DEFAULT true,
  resolved boolean DEFAULT false,
  resolved_by text,
  resolved_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE fraud_flags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage fraud_flags" ON fraud_flags;
CREATE POLICY "Service role can manage fraud_flags" ON fraud_flags FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_property_id ON fraud_flags(property_id);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_severity ON fraud_flags(severity);

CREATE TABLE IF NOT EXISTS eco_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  carbon_potential_score numeric,
  reforestation_potential text,
  agroforestry_suitability text,
  renewable_energy_suitability text,
  soil_quality text,
  biodiversity_index numeric,
  climate_risk_score numeric,
  analysis_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE eco_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage eco_scores" ON eco_scores;
CREATE POLICY "Service role can manage eco_scores" ON eco_scores FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_eco_scores_property_id ON eco_scores(property_id);

CREATE TABLE IF NOT EXISTS escrow_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  buyer_email text,
  seller_email text,
  buyer_phone text,
  amount numeric,
  currency text DEFAULT 'UGX',
  milestones jsonb,
  payment_ref text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'disputed', 'cancelled')),
  escrow_type text DEFAULT 'purchase' CHECK (escrow_type IN ('purchase', 'booking', 'consultation')),
  gps_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage escrow_transactions" ON escrow_transactions;
CREATE POLICY "Service role can manage escrow_transactions" ON escrow_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can insert escrow_transactions" ON escrow_transactions FOR INSERT WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_property_id ON escrow_transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_status ON escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_buyer_email ON escrow_transactions(buyer_email);

CREATE TABLE IF NOT EXISTS land_passports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  passport_id text UNIQUE NOT NULL,
  gps_coordinates text,
  drone_images text[] DEFAULT '{}',
  ownership_history jsonb,
  verification_certificate_url text,
  boundary_coordinates jsonb,
  area_measured numeric,
  survey_date date,
  issued_at timestamptz,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'verified', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE land_passports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage land_passports" ON land_passports;
CREATE POLICY "Service role can manage land_passports" ON land_passports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read access for land_passports" ON land_passports FOR SELECT USING (true);
CREATE INDEX IF NOT EXISTS idx_land_passports_property_id ON land_passports(property_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_land_passports_passport_id ON land_passports(passport_id);

CREATE TABLE IF NOT EXISTS fractional_investments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  total_shares integer NOT NULL,
  shares_available integer NOT NULL,
  price_per_share numeric NOT NULL,
  currency text DEFAULT 'UGX',
  min_shares integer DEFAULT 1,
  roi_projection numeric,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'sold_out')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE fractional_investments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage fractional_investments" ON fractional_investments;
CREATE POLICY "Service role can manage fractional_investments" ON fractional_investments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read access for fractional_investments" ON fractional_investments FOR SELECT USING (true);
CREATE INDEX IF NOT EXISTS idx_fractional_investments_property_id ON fractional_investments(property_id);
CREATE INDEX IF NOT EXISTS idx_fractional_investments_status ON fractional_investments(status);

CREATE TABLE IF NOT EXISTS investment_holdings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fractional_investment_id uuid REFERENCES fractional_investments(id) ON DELETE CASCADE,
  investor_email text NOT NULL,
  investor_name text,
  investor_phone text,
  shares_owned integer NOT NULL,
  amount_invested numeric NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'sold')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE investment_holdings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage investment_holdings" ON investment_holdings;
CREATE POLICY "Service role can manage investment_holdings" ON investment_holdings FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_investment_id ON investment_holdings(fractional_investment_id);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_investor_email ON investment_holdings(investor_email);

CREATE TABLE IF NOT EXISTS site_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  visitor_name text,
  visitor_email text,
  visitor_phone text,
  visit_type text CHECK (visit_type IN ('physical', 'virtual', 'drone')),
  scheduled_date timestamptz,
  gps_checkin text,
  gps_checkin_time timestamptz,
  visit_report_url text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  broker_id uuid,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage site_visits" ON site_visits;
CREATE POLICY "Service role can manage site_visits" ON site_visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can insert site_visits" ON site_visits FOR INSERT WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_site_visits_property_id ON site_visits(property_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_status ON site_visits(status);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_email ON site_visits(visitor_email);

CREATE TABLE IF NOT EXISTS property_matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text,
  user_phone text,
  budget_min numeric,
  budget_max numeric,
  preferred_location text,
  preferred_category text,
  min_acres numeric,
  investment_goals text,
  matched_properties jsonb,
  match_scores jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE property_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage property_matches" ON property_matches;
CREATE POLICY "Service role can manage property_matches" ON property_matches FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_property_matches_user_email ON property_matches(user_email);

CREATE TABLE IF NOT EXISTS property_valuations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  estimated_value numeric,
  confidence_score numeric,
  comparable_properties jsonb,
  soil_data jsonb,
  climate_risk text,
  crop_suitability text[],
  arable_acres numeric,
  analysis_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE property_valuations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage property_valuations" ON property_valuations;
CREATE POLICY "Service role can manage property_valuations" ON property_valuations FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_property_valuations_property_id ON property_valuations(property_id);

CREATE TABLE IF NOT EXISTS broker_followups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid,
  customer_name text,
  customer_phone text,
  customer_email text,
  inquiry_type text,
  message text,
  status text DEFAULT 'pending',
  assigned_broker_id uuid,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE broker_followups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage broker_followups" ON broker_followups;
CREATE POLICY "Service role can manage broker_followups" ON broker_followups FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_broker_followups_status ON broker_followups(status);
CREATE INDEX IF NOT EXISTS idx_broker_followups_phone ON broker_followups(customer_phone);

-- Add new columns to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS eco_score numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS passport_id text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_tokenized boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS valuation_estimate numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fraud_risk_level text DEFAULT 'low';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
`

export default async function handler(req, res) {
  if (req.query.secret !== 'setup-v3-2026') return res.status(403).json({ error: "Forbidden" })

  // Try connecting via pg with various connection strings
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  
  if (dbUrl) {
    try {
      const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })
      await client.connect()
      await client.query(SQL)
      await client.end()
      return res.status(200).json({ success: true, message: "v3.0 tables created via DATABASE_URL" })
    } catch (err) {
      // Fall through to Supabase API approach
    }
  }

  // Try using the Supabase SQL endpoint via fetch
  try {
    const projectRef = "emldbjqegftrngxypeca"
    const response = await fetch(`https://${projectRef}.supabase.co/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPA_KEY}`,
        'apikey': SUPA_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: SQL })
    })
    
    if (response.ok) {
      return res.status(200).json({ success: true, message: "v3.0 tables created via Supabase RPC" })
    }
  } catch (err) {
    // Fall through
  }

  return res.status(500).json({ 
    error: "Could not run migration automatically. Please run supabase/migrations/004_v3_features.sql in your Supabase SQL Editor.",
    instructions: "Go to https://supabase.com/dashboard/project/emldbjqegftrngxypeca/sql/new and paste the SQL from supabase/migrations/004_v3_features.sql"
  })
}
