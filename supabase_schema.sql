-- =====================================================
-- SAGECO EVERGREEN — Full Schema (v2, fixed)
-- Run this in Supabase SQL editor
-- =====================================================

-- ── Properties ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title                 text NOT NULL,
  description           text,
  price                 numeric NOT NULL DEFAULT 0,
  location              text NOT NULL,
  -- FIX: added 'Plot' to category constraint
  category              text CHECK (category IN ('Residential','Commercial','Land','Plot','Green Project')),
  sub_type              text,
  -- Residential / Commercial
  bedrooms              integer,
  bathrooms             integer,
  area_sqft             numeric,
  floor_level           text,
  -- Land / Plot
  land_acres            numeric,
  plot_feet             text,
  -- Shared extras
  water_available       text,
  electricity_available text,
  road_distance_km      numeric,
  fence                 text,
  title_deed            text,
  is_negotiable         boolean DEFAULT false,
  -- Contact
  contact_name          text,
  contact_phone         text,
  -- Media
  images                text[],
  -- Status & meta
  status                text DEFAULT 'pending' CHECK (status IN ('available','sold','rented','pending','deleted')),
  featured              boolean DEFAULT false,
  views                 integer DEFAULT 0,
  broker_id             uuid,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at ON properties;
CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Brokers ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brokers (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name           text NOT NULL,
  email               text UNIQUE NOT NULL,
  phone               text NOT NULL,
  photo_url           text,
  bio                 text,
  location            text,
  specialization      text,
  plan                text DEFAULT 'free' CHECK (plan IN ('free','basic','pro','premium')),
  registration_status text DEFAULT 'pending' CHECK (registration_status IN ('pending','registered','active')),
  registration_paid   boolean DEFAULT false,
  activation_paid     boolean DEFAULT false,
  registration_ref    text,
  activation_ref      text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- ── User Profiles ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email      text,
  full_name  text,
  role       text DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

-- ── Bookings ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id  uuid REFERENCES properties(id) ON DELETE SET NULL,
  full_name    text,
  phone        text,
  email        text,
  message      text,
  viewing_date date,
  status       text DEFAULT 'pending',
  created_at   timestamptz DEFAULT now()
);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE properties   ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings     ENABLE ROW LEVEL SECURITY;

-- Drop old policies before recreating
DROP POLICY IF EXISTS "Public can read available properties" ON properties;
DROP POLICY IF EXISTS "Anyone can insert property" ON properties;
DROP POLICY IF EXISTS "Public can read active brokers" ON brokers;
DROP POLICY IF EXISTS "Anyone can insert broker" ON brokers;

-- Properties policies
CREATE POLICY "Public can read available properties"
  ON properties FOR SELECT USING (status = 'available');

CREATE POLICY "Anyone can insert property"
  ON properties FOR INSERT WITH CHECK (true);

-- FIX: Service role can update/delete (for admin panel)
CREATE POLICY "Service role full access on properties"
  ON properties FOR ALL USING (true);

-- Brokers policies
CREATE POLICY "Public can read active brokers"
  ON brokers FOR SELECT USING (registration_status IN ('registered','active'));

CREATE POLICY "Anyone can insert broker"
  ON brokers FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access on brokers"
  ON brokers FOR ALL USING (true);

-- Bookings — only service role
CREATE POLICY "Service role full access on bookings"
  ON bookings FOR ALL USING (true);

-- User profiles — own data only
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role full access on profiles"
  ON user_profiles FOR ALL USING (true);

-- ── Indexes for fast queries ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_properties_status   ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_created  ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_broker   ON properties(broker_id);
CREATE INDEX IF NOT EXISTS idx_properties_views    ON properties(views DESC);

-- ── Alter existing table if already created (safe migration) ─────────────────
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sub_type              text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_level           text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS land_acres            numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_feet             text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS water_available       text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS electricity_available text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS road_distance_km      numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fence                 text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_deed            text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_negotiable         boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_name          text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_phone         text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_sqft             numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS views                 integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_at            timestamptz DEFAULT now();
ALTER TABLE brokers    ADD COLUMN IF NOT EXISTS plan                  text DEFAULT 'free';
ALTER TABLE brokers    ADD COLUMN IF NOT EXISTS updated_at            timestamptz DEFAULT now();

-- Fix category constraint to include 'Plot'
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_category_check;
ALTER TABLE properties ADD CONSTRAINT properties_category_check
  CHECK (category IN ('Residential','Commercial','Land','Plot','Green Project'));

-- Fix status constraint to include 'rented' and 'deleted'
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties ADD CONSTRAINT properties_status_check
  CHECK (status IN ('available','sold','rented','pending','deleted'));

