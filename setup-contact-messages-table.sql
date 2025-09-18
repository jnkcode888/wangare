-- Contact messages table setup
-- Run this in your Supabase SQL Editor

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  subject VARCHAR NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  priority VARCHAR DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  source VARCHAR DEFAULT 'website' CHECK (source IN ('website', 'email', 'phone')),
  assigned_to VARCHAR,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, phone, subject, message, status, priority, source) VALUES
('Sarah Mwangi', 'sarah.mwangi@email.com', '+254 712 345 678', 'Custom Bag Order Inquiry', 'Hi, I''m interested in ordering a custom leather bag. Could you please provide more information about your customization options and pricing?', 'new', 'high', 'website'),
('Amina Hassan', 'amina.hassan@email.com', NULL, 'Store Location Inquiry', 'Where is your physical store located? I''d like to visit and see your products in person.', 'read', 'medium', 'website'),
('Lisa Johnson', 'lisa.johnson@email.com', '+254 723 456 789', 'Amazing Quality!', 'I received my order yesterday and I''m absolutely thrilled with the quality. The craftsmanship is exceptional!', 'replied', 'low', 'website'),
('John Doe', 'john.doe@email.com', '+254 734 567 890', 'Delivery Issue', 'My order was supposed to arrive yesterday but I haven''t received it yet. The tracking shows it''s still in transit.', 'new', 'high', 'website'),
('Mary Wanjiku', 'mary.wanjiku@email.com', '+254 745 678 901', 'Product Availability', 'Do you have the Nairobi Tote in stock? I''d like to purchase one for my daughter''s birthday.', 'read', 'medium', 'website')
ON CONFLICT (id) DO NOTHING;

-- Verify the table was created
SELECT COUNT(*) as total_messages FROM contact_messages;
SELECT COUNT(*) as new_messages FROM contact_messages WHERE status = 'new';
SELECT COUNT(*) as read_messages FROM contact_messages WHERE status = 'read';