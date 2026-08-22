-- ============================================================
-- SAGECO EVERGREEN — Database Schema Migration v3.0 Features
-- File: supabase/migrations/004_v3_features.sql
-- Description: Adds tables, indexes, and RLS policies for v3.0 features
-- ============================================================

-- Ensure pgcrypto extension is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. PROPERTY VERIFICATIONS ──────────────────────────────────────────
-- Drone and spatial verification records per property
CREATE TABLE IF NOT EXISTS property_verifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  verification_type text CHECK (verification_type IN ('drone', 'lidar', 'ground')),
  boundary_geojson jsonb,
  drone_images text[] DEFAULT '{}',
  3d_model_url text,
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

DROP POLICY IF EXISTS "Public read access for property_verifications" ON property_verifications;
CREATE POLICY "Public read access for property_verifications" ON property_verifications FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_property_verifications_property_id ON property_verifications(property_id);
CREATE INDEX IF NOT EXISTS idx_property_verifications_status ON property_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_property_verifications_type ON property_verifications(verification_type);


-- ── 2. FRAUD FLAGS ─────────────────────────────────────────────────────
-- AI fraud detection records
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

DROP POLICY IF EXISTS "Public read access for fraud_flags" ON fraud_flags;
CREATE POLICY "Public read access for fraud_flags" ON fraud_flags FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_fraud_flags_property_id ON fraud_flags(property_id);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_flag_type ON fraud_flags(flag_type);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_severity ON fraud_flags(severity);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_resolved ON fraud_flags(resolved);


-- ── 3. ECO SCORES ──────────────────────────────────────────────────────
-- Eco-land investment intelligence per property
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

DROP POLICY IF EXISTS "Public read access for eco_scores" ON eco_scores;
CREATE POLICY "Public read access for eco_scores" ON eco_scores FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_eco_scores_property_id ON eco_scores(property_id);


-- ── 4. ESCROW TRANSACTIONS ─────────────────────────────────────────────
-- Programmable escrow for land & property transactions
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

DROP POLICY IF EXISTS "Public read access for escrow_transactions" ON escrow_transactions;
CREATE POLICY "Public read access for escrow_transactions" ON escrow_transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert escrow_transactions" ON escrow_transactions;
CREATE POLICY "Anyone can insert escrow_transactions" ON escrow_transactions FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_escrow_transactions_property_id ON escrow_transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_status ON escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_buyer_email ON escrow_transactions(buyer_email);


-- ── 5. LAND PASSPORTS ──────────────────────────────────────────────────
-- Digital land passports with spatial and ownership history
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

DROP POLICY IF EXISTS "Public read access for land_passports" ON land_passports;
CREATE POLICY "Public read access for land_passports" ON land_passports FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_land_passports_property_id ON land_passports(property_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_land_passports_passport_id ON land_passports(passport_id);
CREATE INDEX IF NOT EXISTS idx_land_passports_status ON land_passports(status);


-- ── 6. FRACTIONAL INVESTMENTS ──────────────────────────────────────────
-- Tokenized fractional investment listings
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

DROP POLICY IF EXISTS "Public read access for fractional_investments" ON fractional_investments;
CREATE POLICY "Public read access for fractional_investments" ON fractional_investments FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_fractional_investments_property_id ON fractional_investments(property_id);
CREATE INDEX IF NOT EXISTS idx_fractional_investments_status ON fractional_investments(status);


-- ── 7. INVESTMENT HOLDINGS ────────────────────────────────────────────
-- Individual investor holdings for tokenized properties
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

DROP POLICY IF EXISTS "Public read access for investment_holdings" ON investment_holdings;
CREATE POLICY "Public read access for investment_holdings" ON investment_holdings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert investment_holdings" ON investment_holdings;
CREATE POLICY "Anyone can insert investment_holdings" ON investment_holdings FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_investment_holdings_fractional_id ON investment_holdings(fractional_investment_id);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_investor_email ON investment_holdings(investor_email);
CREATE INDEX IF NOT EXISTS idx_investment_holdings_status ON investment_holdings(status);


-- ── 8. SITE VISITS ─────────────────────────────────────────────────────
-- Remote and physical site-visit technology
CREATE TABLE IF NOT EXISTS site_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  visitor_phone text,
  visit_type text DEFAULT 'physical' CHECK (visit_type IN ('physical', 'virtual', 'drone')),
  scheduled_date timestamptz,
  gps_checkin text,
  gps_checkin_time timestamptz,
  visit_report_url text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  broker_id uuid REFERENCES brokers(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage site_visits" ON site_visits;
CREATE POLICY "Service role can manage site_visits" ON site_visits FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read access for site_visits" ON site_visits;
CREATE POLICY "Public read access for site_visits" ON site_visits FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert site_visits" ON site_visits;
CREATE POLICY "Anyone can insert site_visits" ON site_visits FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_site_visits_property_id ON site_visits(property_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_broker_id ON site_visits(broker_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_status ON site_visits(status);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_email ON site_visits(visitor_email);


-- ── 9. PROPERTY MATCHES ────────────────────────────────────────────────
-- Smart property matching preferences and results
CREATE TABLE IF NOT EXISTS property_matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email text NOT NULL,
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

DROP POLICY IF EXISTS "Public read access for property_matches" ON property_matches;
CREATE POLICY "Public read access for property_matches" ON property_matches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert property_matches" ON property_matches;
CREATE POLICY "Anyone can insert property_matches" ON property_matches FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_property_matches_user_email ON property_matches(user_email);


-- ── 10. PROPERTY VALUATIONS ───────────────────────────────────────────
-- Predictive valuation and arable analytics
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
  analysis_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE property_valuations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage property_valuations" ON property_valuations;
CREATE POLICY "Service role can manage property_valuations" ON property_valuations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read access for property_valuations" ON property_valuations;
CREATE POLICY "Public read access for property_valuations" ON property_valuations FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_property_valuations_property_id ON property_valuations(property_id);


-- ── 11. BROKER FOLLOWUPS ──────────────────────────────────────────────
-- AI broker followup tasks
CREATE TABLE IF NOT EXISTS broker_followups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  customer_name text,
  customer_phone text,
  customer_email text,
  inquiry_type text,
  message text,
  status text DEFAULT 'pending',
  assigned_broker_id uuid REFERENCES brokers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE broker_followups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage broker_followups" ON broker_followups;
CREATE POLICY "Service role can manage broker_followups" ON broker_followups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read access for broker_followups" ON broker_followups;
CREATE POLICY "Public read access for broker_followups" ON broker_followups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert broker_followups" ON broker_followups;
CREATE POLICY "Anyone can insert broker_followups" ON broker_followups FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_broker_followups_property_id ON broker_followups(property_id);
CREATE INDEX IF NOT EXISTS idx_broker_followups_assigned_broker_id ON broker_followups(assigned_broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_followups_status ON broker_followups(status);


-- ── 12. ALTER PROPERTIES TABLE FOR V3.0 FEATURES ──────────────────────
-- Add v3.0 feature columns to existing properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS eco_score numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS passport_id text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_tokenized boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS valuation_estimate numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fraud_risk_level text DEFAULT 'low';

-- Indexes for new properties columns
CREATE INDEX IF NOT EXISTS idx_properties_verification_status ON properties(verification_status);
CREATE INDEX IF NOT EXISTS idx_properties_passport_id ON properties(passport_id);
CREATE INDEX IF NOT EXISTS idx_properties_is_tokenized ON properties(is_tokenized);
CREATE INDEX IF NOT EXISTS idx_properties_fraud_risk_level ON properties(fraud_risk_level);
