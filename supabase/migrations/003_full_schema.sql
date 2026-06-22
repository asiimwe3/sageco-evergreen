-- ============================================================
-- SAGECO EVERGREEN — Full Production Schema Migration v3
-- Run this in Supabase SQL Editor to ensure the full schema
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USER PROFILES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'customer' CHECK (role IN ('customer','broker','admin')),
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Service role can manage all" ON user_profiles;
CREATE POLICY "Service role can manage all" ON user_profiles USING (true);

-- ── PROPERTIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  location text NOT NULL,
  category text CHECK (category IN ('Residential','Commercial','Land','Plot','Green Project')),
  sub_type text,
  bedrooms integer,
  bathrooms integer,
  area_sqft numeric,
  floor_level text,
  land_acres numeric,
  plot_feet text,
  water_available text,
  electricity_available text,
  road_distance_km numeric,
  fence text,
  title_deed text,
  is_negotiable boolean DEFAULT false,
  contact_name text,
  contact_phone text,
  images text[],
  status text DEFAULT 'available' CHECK (status IN ('available','sold','pending','rented')),
  featured boolean DEFAULT false,
  broker_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns if they exist already as older schema
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sub_type text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_level text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS land_acres numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_feet text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS water_available text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS electricity_available text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS road_distance_km numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fence text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_deed text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_negotiable boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_name text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read available properties" ON properties;
CREATE POLICY "Public can read available properties" ON properties FOR SELECT USING (status = 'available');
DROP POLICY IF EXISTS "Anyone can insert property" ON properties;
CREATE POLICY "Anyone can insert property" ON properties FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Service can manage properties" ON properties;
CREATE POLICY "Service can manage properties" ON properties USING (true);

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);

-- ── BROKERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brokers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id text UNIQUE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  photo_url text,
  bio text,
  location text,
  specialization text,
  registration_status text DEFAULT 'pending' CHECK (registration_status IN ('pending','registered','active','suspended')),
  registration_paid boolean DEFAULT false,
  activation_paid boolean DEFAULT false,
  registration_ref text,
  activation_ref text,
  plan text DEFAULT 'free' CHECK (plan IN ('free','basic','pro','premium')),
  plan_expires_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brokers ADD COLUMN IF NOT EXISTS broker_id text;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active brokers" ON brokers;
CREATE POLICY "Public can read active brokers" ON brokers FOR SELECT USING (registration_status IN ('registered','active'));
DROP POLICY IF EXISTS "Anyone can insert broker" ON brokers;
CREATE POLICY "Anyone can insert broker" ON brokers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Service can manage brokers" ON brokers;
CREATE POLICY "Service can manage brokers" ON brokers USING (true);

CREATE UNIQUE INDEX IF NOT EXISTS idx_brokers_broker_id ON brokers(broker_id) WHERE broker_id IS NOT NULL;

-- ── BOOKINGS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reference text UNIQUE NOT NULL,
  property_id uuid,
  property_title text,
  broker_id uuid,
  broker_name text,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  preferred_date date,
  time_slot text,
  booking_type text DEFAULT 'viewing' CHECK (booking_type IN ('viewing','consultation','site_visit')),
  message text,
  whatsapp_updates boolean DEFAULT true,
  total_amount numeric DEFAULT 0,
  business_share numeric DEFAULT 0,
  broker_share numeric DEFAULT 0,
  payment_type text,
  payment_ref text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled','rescheduled','no_show')),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS time_slot text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_type text DEFAULT 'viewing';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS whatsapp_updates boolean DEFAULT true;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_ref text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update status constraint to include all statuses
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending','confirmed','completed','cancelled','rescheduled','no_show'));

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage bookings" ON bookings;
CREATE POLICY "Service can manage bookings" ON bookings USING (true);
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT
  USING (customer_email = (SELECT email FROM user_profiles WHERE id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);

-- ── CONTACT MESSAGES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread','read','replied','subscription_pending')),
  reply text,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS reply text;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS replied_at timestamptz;

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert message" ON contact_messages;
CREATE POLICY "Anyone can insert message" ON contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Service can manage messages" ON contact_messages;
CREATE POLICY "Service can manage messages" ON contact_messages USING (true);

-- ── JOB APPLICATIONS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  job_title text NOT NULL,
  department text,
  cover_letter text,
  cv_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','reviewed','shortlisted','rejected')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can apply" ON job_applications;
CREATE POLICY "Anyone can apply" ON job_applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Service can manage applications" ON job_applications;
CREATE POLICY "Service can manage applications" ON job_applications USING (true);

-- ── OFFICERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS officers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  role text NOT NULL,
  department text,
  email text,
  phone text,
  photo_url text,
  bio text,
  status text DEFAULT 'active' CHECK (status IN ('active','inactive')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE officers ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active officers" ON officers;
CREATE POLICY "Public can read active officers" ON officers FOR SELECT USING (status = 'active');
DROP POLICY IF EXISTS "Service can manage officers" ON officers;
CREATE POLICY "Service can manage officers" ON officers USING (true);

-- ── STORAGE BUCKETS ──────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('broker-photos', 'broker-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
CREATE POLICY "Public read property images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
DROP POLICY IF EXISTS "Anyone upload property images" ON storage.objects;
CREATE POLICY "Anyone upload property images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('property-images','broker-photos','cvs'));

SELECT 'SAGECO EVERGREEN Schema v3 — Migration Complete ✅' AS status;
