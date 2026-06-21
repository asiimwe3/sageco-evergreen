-- SAGECO EVERGREEN — Booking System Enhancements
-- Run this in: Supabase Dashboard > SQL Editor > New Query

-- Add new columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS time_slot text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_type text DEFAULT 'viewing' CHECK (booking_type IN ('viewing','consultation','site_visit'));
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS whatsapp_updates boolean DEFAULT true;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_notes text;

-- Add more status options
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending','confirmed','completed','cancelled','rescheduled','no_show'));

-- Update the payment_type constraint to be more flexible
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_type_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_payment_type_check
  CHECK (payment_type IN ('officer_property','broker_property','consultation','site_visit'));

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);

-- Done!
SELECT 'Booking enhancements migration complete' as status;
