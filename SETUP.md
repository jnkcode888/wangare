# WangareLuxe E-commerce Setup Guide

## Overview

This is a complete e-commerce solution for WangareLuxe featuring:

- Product catalog with categories (bags, perfumes, jewelry, home items, accessories, bridal)
- Guest checkout (no account creation required)
- Manual M-Pesa payment verification system
- Admin dashboard for order management
- Automatic email notifications
- Receipt generation system

## Prerequisites

- Node.js 16+ installed
- Supabase account
- Email service (optional for production)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Set up Database

1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL to create the database schema:

```sql
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url) VALUES
('The Nairobi Tote', 'Signature Wangari Luxe leather tote bag', 1250000, 'bags', 'https://images.unsplash.com/photo-1590739225287-bd2d682c8bf8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'),
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
```

#### Set up Storage (for payment screenshots and product images)

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "order-attachments"
3. Create another bucket called "product-images"
4. Set both buckets to **public**
5. **Important**: Configure RLS policies for uploads

**For the `product-images` bucket, add these RLS policies:**

Go to **Storage** > **Policies** > **product-images** and add:

**Policy 1: Allow public uploads**

```sql
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');
```

**Policy 2: Allow public access**

```sql
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

**Policy 3: Allow public updates**

```sql
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');
```

**Policy 4: Allow public deletes**

```sql
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
```

**For the `order-attachments` bucket, add the same policies:**

```sql
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'order-attachments');

CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'order-attachments');

CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'order-attachments');

CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'order-attachments');
```

### 3. Environment Configuration

#### Update Supabase Configuration

Edit `src/lib/supabase.ts` and replace the placeholder values:

```typescript
const supabaseUrl = "YOUR_ACTUAL_SUPABASE_URL";
const supabaseAnonKey = "YOUR_ACTUAL_SUPABASE_ANON_KEY";
```

#### Update M-Pesa Till Number

In `src/pages/CheckoutPage.tsx`, update the till number:

```typescript
<strong>
  Pay KES {total.toLocaleString()} to Till Number: YOUR_TILL_NUMBER (Wangari
  Kairu)
</strong>
```

### 4. Run the Application

```bash
npm run dev
```

## Features Overview

### Customer Experience

1. **Browse Products**: View products by category with filtering and sorting
2. **Product Details**: Detailed product pages with images and descriptions
3. **Shopping Cart**: Add/remove items, adjust quantities
4. **Guest Checkout**: No account creation required
5. **M-Pesa Payment**: Manual payment with transaction code/screenshot upload
6. **Order Confirmation**: Automatic email with receipt number

### Admin Dashboard

Access the admin dashboard at `/admin` to:

1. **View Pending Orders**: See all orders awaiting payment verification
2. **Payment Verification**: Mark orders as paid/failed after checking M-Pesa
3. **Order Management**: View customer details, order items, and payment proof
4. **Email Notifications**: Automatic emails sent to customers on status updates

### Order Flow

1. Customer browses and adds products to cart
2. Customer enters details (name, phone, email, delivery address)
3. System shows M-Pesa payment instructions
4. Customer pays via M-Pesa and provides transaction code/screenshot
5. System creates order with "Pending Verification" status
6. Customer receives confirmation email with receipt number
7. Admin checks M-Pesa and marks order as "Paid" or "Failed"
8. Customer receives status update email

## Production Considerations

### Email Service Integration

The current implementation uses mock email service. For production:

1. Integrate with EmailJS, SendGrid, or similar service
2. Update `src/services/emailService.ts`
3. Set up proper email templates

### Security

1. Add proper authentication for admin dashboard
2. Implement rate limiting
3. Add input validation and sanitization
4. Set up proper CORS policies

### Performance

1. Implement image optimization
2. Add caching for product data
3. Set up CDN for static assets
4. Consider pagination for large product catalogs

### Payment Integration

For automated payment verification:

1. Integrate with M-Pesa API
2. Set up webhooks for real-time payment notifications
3. Implement automatic order status updates

## Customization

### Styling

- Colors and fonts are defined in `src/index.css`
- Component styles use Tailwind CSS
- Brand colors: gold (#D4AF37), luxe-black (#1A1A1A)

### Products

- Add/edit products through Supabase dashboard
- Images should be hosted on a reliable CDN
- Prices are stored in cents (multiply by 100)

### Categories

Update categories in:

- `src/pages/HomePage.tsx` (category display)
- `src/pages/ProductsPage.tsx` (filtering)
- `src/components/layout/Header.tsx` (navigation)

## Support

For questions or issues, contact the development team or refer to the documentation in the codebase.
