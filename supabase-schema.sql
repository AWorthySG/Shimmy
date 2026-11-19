-- Supabase SQL: Run this in your Supabase SQL Editor to create the booking tables.
-- Dashboard → SQL Editor → New Query → Paste & Run

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,                -- HH:MM 24-hour format
  duration_minutes INTEGER NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocked dates (holidays, personal days off)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason TEXT
);

-- Index for fast slot lookups
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates (date);

-- Row Level Security: allow anyone to insert (public booking), read only non-cancelled
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Public can create bookings
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public can read active bookings (for slot availability)
CREATE POLICY "Anyone can read active bookings"
  ON bookings FOR SELECT
  TO anon
  USING (status != 'cancelled');

-- Public can read blocked dates
CREATE POLICY "Anyone can read blocked dates"
  ON blocked_dates FOR SELECT
  TO anon
  USING (true);

-- Restock alerts: emails waiting for a product to come back in stock.
-- Run this block in the Supabase SQL editor before using the restock form.
CREATE TABLE IF NOT EXISTS restock_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) <= 254),
  product_handle text NOT NULL CHECK (char_length(product_handle) <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  notified_at timestamptz,
  UNIQUE (email, product_handle)
);

ALTER TABLE restock_notifications ENABLE ROW LEVEL SECURITY;

-- Public can sign up; no public read, so the email list stays private.
CREATE POLICY "Anyone can sign up for restock alerts"
  ON restock_notifications FOR INSERT
  TO anon
  WITH CHECK (true);
