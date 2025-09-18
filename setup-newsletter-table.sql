-- Newsletter subscribers table setup
-- Run this in your Supabase SQL Editor

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  discount_code VARCHAR
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);

-- Insert sample newsletter subscribers
INSERT INTO newsletter_subscribers (email, subscribed_at, is_active, discount_code) VALUES
('sarah.mwangi@email.com', '2025-01-15 10:30:00', true, 'WELCOME123'),
('amina.hassan@email.com', '2025-01-10 14:20:00', true, 'WELCOME456'),
('john.doe@email.com', '2025-01-05 09:15:00', true, 'WELCOME789'),
('mary.wanjiku@email.com', '2025-01-20 16:45:00', true, 'WELCOME101'),
('peter.kimani@email.com', '2025-01-18 11:30:00', false, 'WELCOME202')
ON CONFLICT (email) DO NOTHING;

-- Verify the table was created
SELECT COUNT(*) as total_subscribers FROM newsletter_subscribers;
SELECT COUNT(*) as active_subscribers FROM newsletter_subscribers WHERE is_active = true;
