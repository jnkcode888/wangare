import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://agwplrggetyxkuygfdxw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnd3BscmdnZXR5eGt1eWdmZHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Njg3NTgsImV4cCI6MjA3MzU0NDc1OH0.CsBTJGUgNIV_ZO3izPfQWPar5v_e3-OAPa4v-JD05Hs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Product = {
  id: string
  name: string
  description?: string
  price: number
  category: string
  image_url: string
  created_at?: string
  updated_at?: string
}

export type Order = {
  id: string
  receipt_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address?: string
  total_amount: number
  status: 'pending_verification' | 'paid' | 'failed' | 'shipped'
  payment_method: 'mpesa'
  transaction_code?: string
  transaction_screenshot?: string
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  priority: 'low' | 'medium' | 'high'
  source: 'website' | 'email' | 'phone'
  assigned_to?: string
  internal_notes?: string
  created_at: string
  updated_at: string
}

// Database setup SQL (to be run in Supabase SQL editor)
export const DATABASE_SCHEMA = `
-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents (KES)
  category VARCHAR NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR UNIQUE NOT NULL,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  customer_phone VARCHAR NOT NULL,
  delivery_address TEXT,
  total_amount INTEGER NOT NULL, -- Total in cents (KES)
  status VARCHAR DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'paid', 'failed', 'shipped')),
  payment_method VARCHAR DEFAULT 'mpesa',
  transaction_code VARCHAR,
  transaction_screenshot TEXT, -- URL to uploaded screenshot
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR NOT NULL,
  product_price INTEGER NOT NULL, -- Price in cents at time of order
  quantity INTEGER NOT NULL,
  subtotal INTEGER NOT NULL -- Quantity * price in cents
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  discount_code VARCHAR
);

-- Contact messages table
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
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Insert sample newsletter subscribers
INSERT INTO newsletter_subscribers (email, subscribed_at, is_active, discount_code) VALUES
('sarah.mwangi@email.com', '2025-01-15 10:30:00', true, 'WELCOME123'),
('amina.hassan@email.com', '2025-01-10 14:20:00', true, 'WELCOME456'),
('john.doe@email.com', '2025-01-05 09:15:00', true, 'WELCOME789'),
('mary.wanjiku@email.com', '2025-01-20 16:45:00', true, 'WELCOME101'),
('peter.kimani@email.com', '2025-01-18 11:30:00', false, 'WELCOME202');

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url) VALUES
('The Nairobi Tote', 'Signature WangarèLuxe leather tote bag', 1250000, 'bags', 'https://images.unsplash.com/photo-1590739225287-bd2d682c8bf8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Amber Sunset Perfume', 'Captivating scent with notes of amber and vanilla', 890000, 'perfumes', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Gold Pearl Earrings', 'Timeless elegance in 18k gold with natural pearls', 650000, 'jewelry', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Silk Pillowcase Set', 'Luxurious mulberry silk pillowcases for better sleep', 450000, 'home', 'https://images.unsplash.com/photo-1629949009765-718383f03516?q=80&w=1180&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Luxury Scented Candle', 'Hand-poured candle with premium fragrance oils', 320000, 'home', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Designer Sunglasses', 'UV protection with sophisticated style', 750000, 'accessories', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Bridal Silk Robe', 'Elegant silk robe perfect for your special day', 980000, 'bridal', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Mini Crossbody Bag', 'Compact crossbody bag for everyday elegance', 850000, 'bags', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Rose Gold Bracelet', 'Delicate rose gold chain bracelet', 520000, 'jewelry', 'https://images.unsplash.com/photo-1575863438850-fb1c06a38885?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Evening Bloom Perfume', 'Floral evening fragrance with jasmine and rose', 950000, 'perfumes', 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1008&auto=format&fit=crop&ixlib=rb-4.0.3'),
('AirPods Pro Case', 'Luxury leather case for your AirPods Pro', 280000, 'accessories', 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Wedding Hair Pins Set', 'Elegant gold hair pins for bridal styling', 420000, 'bridal', 'https://images.unsplash.com/photo-1611165407529-c45a4cefd2ed?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3'),
('Chic Tote Bag', 'Modern tote bag perfect for work and travel', 680000, 'bags', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3');
`;
