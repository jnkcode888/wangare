# Master Email Template Usage Guide

## Overview

This single HTML template contains all your email designs and uses EmailJS Handlebars conditionals to render the appropriate template based on the `template_type` variable.

## Template Types

The master template supports the following template types:

1. **order_confirmation** - Order confirmation email
2. **payment_confirmed** - Payment confirmation email
3. **payment_failed** - Payment failure notification
4. **welcome** - Welcome email for new users
5. **contact_form** - Contact form submission notification
6. **order_shipped** - Order shipped notification
7. **order_delivered** - Order delivered confirmation
8. **admin_notification** - General admin notifications

## How to Use in EmailJS

### 1. Create the Template

1. Go to your EmailJS dashboard
2. Navigate to **Email Templates**
3. Click **Create New Template**
4. Name it: `master_template`
5. Copy and paste the entire HTML content from `masterEmailTemplate.html`
6. Save the template

### 2. Send Emails with Different Types

#### Order Confirmation

```javascript
emailjs.send("your_service_id", "master_template", {
  template_type: "order_confirmation",
  to_name: "John Doe",
  to_email: "john@example.com",
  order_number: "WL-2024-001",
  order_date: "2024-01-15",
  total_amount: "2,500",
  items: "1x Luxury Handbag - KES 2,500",
  shipping_address: "123 Main St, Nairobi, Kenya",
});
```

#### Payment Confirmed

```javascript
emailjs.send("your_service_id", "master_template", {
  template_type: "payment_confirmed",
  to_name: "John Doe",
  to_email: "john@example.com",
  order_number: "WL-2024-001",
  payment_amount: "2,500",
  payment_method: "M-Pesa",
  payment_date: "2024-01-15",
});
```

#### Payment Failed

```javascript
emailjs.send("your_service_id", "master_template", {
  template_type: "payment_failed",
  to_name: "John Doe",
  to_email: "john@example.com",
  order_number: "WL-2024-001",
  payment_amount: "2,500",
  failure_reason: "Incorrect transaction code",
  retry_url: "https://wangareluxe.com/checkout",
});
```

#### Welcome Email

```javascript
emailjs.send("your_service_id", "master_template", {
  template_type: "welcome",
  to_name: "John Doe",
  to_email: "john@example.com",
  welcome_message: "Welcome to our luxury family!",
  discount_code: "WELCOME10",
  website_url: "https://wangareluxe.com",
});
```

#### Contact Form

```javascript
emailjs.send("your_service_id", "master_template", {
  template_type: "contact_form",
  from_name: "Jane Smith",
  from_email: "jane@example.com",
  subject: "Product Inquiry",
  message: "I would like to know more about your handbags.",
  phone: "+254 700 000 000",
});
```

#### Order Shipped

```javascript
emailjs.send("your_service_id", "master_template", {
  template_type: "order_shipped",
  to_name: "John Doe",
  to_email: "john@example.com",
  order_number: "WL-2024-001",
  tracking_number: "TRK123456789",
  shipping_date: "2024-01-16",
  estimated_delivery: "2024-01-18",
  tracking_url: "https://tracking.example.com/TRK123456789",
});
```

#### Order Delivered

```javascript
emailjs.send("your_service_id", "master_template", {
  template_type: "order_delivered",
  to_name: "John Doe",
  to_email: "john@example.com",
  order_number: "WL-2024-001",
  delivery_date: "2024-01-18",
  delivery_address: "123 Main St, Nairobi, Kenya",
  review_url: "https://wangareluxe.com/review/WL-2024-001",
});
```

#### Admin Notification

```javascript
emailjs.send("your_service_id", "master_template", {
  template_type: "admin_notification",
  notification_title: "New Order Received",
  notification_type: "Order",
  priority: "High",
  timestamp: "2024-01-15 14:30:00",
  notification_message:
    "A new order has been placed by John Doe for KES 2,500.",
  admin_dashboard_url: "https://wangareluxe.com/admin",
  action_url: "https://wangareluxe.com/admin/orders",
  action_text: "View Order Details",
});
```

## Template Variables Reference

### Common Variables (All Templates)

- `template_type` - **REQUIRED** - Determines which template to render
- `to_name` - Recipient's name
- `to_email` - Recipient's email

### Order Confirmation Variables

- `order_number` - Order number
- `order_date` - Order date
- `total_amount` - Total amount
- `items` - Items list (formatted)
- `shipping_address` - Delivery address

### Payment Confirmed Variables

- `order_number` - Order number
- `payment_amount` - Payment amount
- `payment_method` - Payment method
- `payment_date` - Payment date

### Payment Failed Variables

- `order_number` - Order number
- `payment_amount` - Payment amount
- `failure_reason` - Reason for failure
- `retry_url` - URL to retry payment

### Welcome Email Variables

- `welcome_message` - Welcome message
- `discount_code` - Discount code
- `website_url` - Website URL

### Contact Form Variables

- `from_name` - Sender's name
- `from_email` - Sender's email
- `subject` - Subject line
- `message` - Message content
- `phone` - Phone number (optional)

### Order Shipped Variables

- `order_number` - Order number
- `tracking_number` - Tracking number
- `shipping_date` - Shipping date
- `estimated_delivery` - Estimated delivery date
- `tracking_url` - Tracking URL

### Order Delivered Variables

- `order_number` - Order number
- `delivery_date` - Delivery date
- `delivery_address` - Delivery address
- `review_url` - Review URL

### Admin Notification Variables

- `notification_title` - Notification title
- `notification_type` - Type of notification
- `priority` - Priority level
- `timestamp` - Notification timestamp
- `notification_message` - Notification message
- `admin_dashboard_url` - Admin dashboard URL
- `action_url` - Action URL
- `action_text` - Action button text

## Benefits of This Approach

1. **Bypasses EmailJS 2-template limit** - One template handles all email types
2. **Easy maintenance** - All templates in one file
3. **Consistent branding** - Same styling across all emails
4. **Flexible** - Easy to add new template types
5. **Cost-effective** - No need for premium EmailJS plans

## Adding New Template Types

To add a new template type:

1. Add a new `{{#if (eq template_type "new_type")}}` block in the HTML
2. Include all necessary variables in the template
3. Update your JavaScript code to use the new template type
4. Document the new variables in this guide

## Testing

Test each template type by sending emails with different `template_type` values to ensure only the correct section renders.
