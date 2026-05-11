-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  location text NOT NULL,
  category text CHECK (category IN ('Residential','Commercial','Land','Green Project')),
  bedrooms integer,
  bathrooms integer,
  area_sqft numeric,
  images text[],
  status text DEFAULT 'available' CHECK (status IN ('available','sold','pending')),
  featured boolean DEFAULT false,
  broker_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Brokers Table
CREATE TABLE IF NOT EXISTS brokers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  photo_url text,
  bio text,
  location text,
  specialization text,
  registration_status text DEFAULT 'pending' CHECK (registration_status IN ('pending','registered','active')),
  registration_paid boolean DEFAULT false,
  activation_paid boolean DEFAULT false,
  registration_ref text,
  activation_ref text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read available properties" ON properties FOR SELECT USING (status = 'available');
CREATE POLICY "Public can read active brokers" ON brokers FOR SELECT USING (registration_status IN ('registered','active'));

-- Insert policies (anyone can submit)
CREATE POLICY "Anyone can insert property" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert broker" ON brokers FOR INSERT WITH CHECK (true);
