-- =====================================================
-- SAGECO EVERGREEN — Migration 005: GPS Columns for Properties
-- Adds gps_lat, gps_lng, gps_district to properties table
-- =====================================================

-- Add GPS columns to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gps_lat double precision;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gps_lng double precision;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gps_district text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gps_coordinates text;

-- Backfill gps_coordinates from gps_lat/lng where they exist
DO $$
BEGIN
  UPDATE properties
    SET gps_coordinates = gps_lat || ',' || gps_lng
    WHERE gps_lat IS NOT NULL AND gps_lng IS NOT NULL AND gps_coordinates IS NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'GPS coordinate backfill skipped';
END $$;

-- Trigger to auto-set gps_coordinates from gps_lat/lng
CREATE OR REPLACE FUNCTION set_gps_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.gps_lat IS NOT NULL AND NEW.gps_lng IS NOT NULL THEN
    NEW.gps_coordinates := NEW.gps_lat || ',' || NEW.gps_lng;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_gps_coordinates ON properties;
CREATE TRIGGER properties_gps_coordinates
  BEFORE INSERT OR UPDATE OF gps_lat, gps_lng ON properties
  FOR EACH ROW EXECUTE FUNCTION set_gps_coordinates();
