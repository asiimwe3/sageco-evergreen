-- SAGECO EVERGREEN — Full Database Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query

-- 1. OFFICERS TABLE (managed from admin panel)
CREATE TABLE IF NOT EXISTS officers (
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
);

-- 2. BOOKINGS TABLE (property viewings with payment split)
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reference text UNIQUE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  property_title text,
  broker_id uuid REFERENCES brokers(id) ON DELETE SET NULL,
  broker_name text,
  officer_id uuid REFERENCES officers(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  preferred_date date,
  message text,
  total_amount integer DEFAULT 30000,
  business_share integer DEFAULT 30000,
  broker_share integer DEFAULT 0,
  payment_type text CHECK (payment_type IN ('officer_property','broker_property')),
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at timestamptz DEFAULT now()
);

-- 3. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS job_applications (
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
  status text DEFAULT 'received' CHECK (status IN ('received','reviewing','shortlisted','rejected','hired')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 4. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread','read','replied')),
  created_at timestamptz DEFAULT now()
);

-- 5. PATCH EXISTING TABLES
ALTER TABLE properties ADD COLUMN IF NOT EXISTS broker_name text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS officer_id uuid REFERENCES officers(id) ON DELETE SET NULL;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS plan text DEFAULT 'basic' CHECK (plan IN ('basic','pro','premium'));
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS notes text;

-- Done!
SELECT 'Migration complete' as status;
