# EmailJS Template Examples

Use these templates in your EmailJS dashboard. Each template should be created with the corresponding Template ID.

## 1. Order Confirmation Template

**Template ID:** `template_order_confirmation`

**Subject:** Order Confirmation - {{order_number}}

**HTML Content:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Order Confirmation - WangarèLuxe</title>
  </head>
  <body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"
  >
    <div
      style="background: linear-gradient(135deg, #D4AF37, #F4E4BC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;"
    >
      <h1 style="color: white; margin: 0; font-size: 28px;">WangarèLuxe</h1>
      <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">
        Luxury Redefined
      </p>
    </div>

    <div
      style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;"
    >
      <h2 style="color: #D4AF37; margin-top: 0;">Order Confirmation</h2>

      <p>Dear {{to_name}},</p>

      <p>
        Thank you for your order with WangarèLuxe! We've received your order and
        it's currently being processed.
      </p>

      <div
        style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #333; margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> {{order_number}}</p>
        <p><strong>Order Date:</strong> {{order_date}}</p>
        <p><strong>Total Amount:</strong> KES {{total_amount}}</p>
      </div>

      <div
        style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #333; margin-top: 0;">Items Ordered</h3>
        <div style="white-space: pre-line;">{{items}}</div>
      </div>

      <div
        style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #333; margin-top: 0;">Delivery Address</h3>
        <p>{{shipping_address}}</p>
      </div>

      <p>
        We've received your payment details and will verify your M-Pesa
        transaction shortly. You will receive another email once your payment
        has been confirmed.
      </p>

      <p>
        Thank you for choosing WangarèLuxe. You will get an update after payment
        verification.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="https://wangareluxe.com"
          style="background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >Visit Our Website</a
        >
      </div>

      <hr
        style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;"
      />

      <p style="font-size: 14px; color: #666;">
        Best regards,<br />
        The WangarèLuxe Team<br />
        <a href="mailto:info@wangareluxe.com">info@wangareluxe.com</a>
      </p>
    </div>
  </body>
</html>
```

## 2. Payment Confirmed Template

**Template ID:** `template_payment_confirmed`

**Subject:** Payment Confirmed - {{order_number}}

**HTML Content:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Payment Confirmed - WangarèLuxe</title>
  </head>
  <body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"
  >
    <div
      style="background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;"
    >
      <h1 style="color: white; margin: 0; font-size: 28px;">
        ✓ Payment Confirmed
      </h1>
      <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">
        WangarèLuxe
      </p>
    </div>

    <div
      style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;"
    >
      <h2 style="color: #28a745; margin-top: 0;">Great News!</h2>

      <p>Dear {{to_name}},</p>

      <p>
        Your payment has been confirmed and your order is now being prepared for
        shipment.
      </p>

      <div
        style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #333; margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> {{order_number}}</p>
        <p><strong>Payment Amount:</strong> KES {{payment_amount}}</p>
        <p><strong>Payment Method:</strong> {{payment_method}}</p>
        <p><strong>Payment Date:</strong> {{payment_date}}</p>
      </div>

      <p>
        Your order {{order_number}} has been confirmed and will be shipped soon.
      </p>

      <p>
        We'll send you tracking information once your order has been dispatched.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="https://wangareluxe.com"
          style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >Track Your Order</a
        >
      </div>

      <hr
        style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;"
      />

      <p style="font-size: 14px; color: #666;">
        Thank you for choosing WangarèLuxe!<br />
        Best regards,<br />
        The WangarèLuxe Team
      </p>
    </div>
  </body>
</html>
```

## 3. Payment Failed Template

**Template ID:** `template_payment_failed`

**Subject:** Payment Verification Issue - {{order_number}}

**HTML Content:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Payment Verification Issue - WangarèLuxe</title>
  </head>
  <body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"
  >
    <div
      style="background: linear-gradient(135deg, #dc3545, #fd7e14); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;"
    >
      <h1 style="color: white; margin: 0; font-size: 28px;">⚠ Payment Issue</h1>
      <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">
        WangarèLuxe
      </p>
    </div>

    <div
      style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;"
    >
      <h2 style="color: #dc3545; margin-top: 0;">Payment Verification Issue</h2>

      <p>Dear {{to_name}},</p>

      <p>We were unable to verify your payment for order {{order_number}}.</p>

      <div
        style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;"
      >
        <h3 style="color: #856404; margin-top: 0;">Possible Reasons:</h3>
        <ul style="color: #856404; margin: 0;">
          <li>Incorrect transaction code</li>
          <li>Payment not yet reflected in our system</li>
          <li>Technical issues</li>
        </ul>
      </div>

      <div
        style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #333; margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> {{order_number}}</p>
        <p><strong>Amount:</strong> KES {{payment_amount}}</p>
        <p><strong>Failure Reason:</strong> {{failure_reason}}</p>
      </div>

      <p>
        Please contact our support team with your M-Pesa transaction details so
        we can resolve this quickly.
      </p>

      <div
        style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #0066cc; margin-top: 0;">Contact Information</h3>
        <p>
          <strong>Email:</strong>
          <a href="mailto:info@wangareluxe.com">info@wangareluxe.com</a>
        </p>
        <p><strong>Phone:</strong> +254 XXX XXX XXX</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{retry_url}}"
          style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >Retry Payment</a
        >
      </div>

      <p>
        We apologize for any inconvenience and look forward to resolving this
        for you.
      </p>

      <hr
        style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;"
      />

      <p style="font-size: 14px; color: #666;">
        Best regards,<br />
        The WangarèLuxe Team
      </p>
    </div>
  </body>
</html>
```

## 4. Welcome Email Template

**Template ID:** `template_welcome`

**Subject:** Welcome to WangarèLuxe!

**HTML Content:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Welcome to WangarèLuxe</title>
  </head>
  <body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"
  >
    <div
      style="background: linear-gradient(135deg, #D4AF37, #F4E4BC); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;"
    >
      <h1 style="color: white; margin: 0; font-size: 32px;">
        Welcome to WangarèLuxe!
      </h1>
      <p style="color: white; margin: 15px 0 0 0; font-size: 18px;">
        Luxury Redefined
      </p>
    </div>

    <div
      style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;"
    >
      <h2 style="color: #D4AF37; margin-top: 0; text-align: center;">
        {{welcome_message}}
      </h2>

      <p>Dear {{to_name}},</p>

      <p>
        Welcome to the WangarèLuxe family! We're thrilled to have you join our
        community of luxury enthusiasts.
      </p>

      <div
        style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;"
      >
        <h3 style="color: #333; margin-top: 0;">🎉 Special Welcome Offer</h3>
        <p style="font-size: 18px; margin: 10px 0;">
          <strong>Get 10% off your first order!</strong>
        </p>
        <p style="font-size: 24px; color: #D4AF37; font-weight: bold;">
          Use code: {{discount_code}}
        </p>
      </div>

      <p>As a member of our exclusive community, you'll enjoy:</p>
      <ul style="color: #666;">
        <li>Early access to new collections</li>
        <li>Exclusive member-only discounts</li>
        <li>Priority customer service</li>
        <li>Luxury lifestyle tips and inspiration</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{website_url}}"
          style="background: #D4AF37; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;"
          >Start Shopping</a
        >
      </div>

      <p>
        Thank you for choosing WangarèLuxe. We can't wait to help you discover
        the perfect pieces for your luxury lifestyle.
      </p>

      <hr
        style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;"
      />

      <p style="font-size: 14px; color: #666; text-align: center;">
        Best regards,<br />
        The WangarèLuxe Team<br />
        <a href="mailto:info@wangareluxe.com">info@wangareluxe.com</a>
      </p>
    </div>
  </body>
</html>
```

## 5. Contact Form Template

**Template ID:** `template_contact_form`

**Subject:** New Contact Form Submission - {{subject}}

**HTML Content:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>New Contact Form Submission - WangarèLuxe</title>
  </head>
  <body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"
  >
    <div
      style="background: linear-gradient(135deg, #D4AF37, #F4E4BC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;"
    >
      <h1 style="color: white; margin: 0; font-size: 28px;">
        New Contact Form
      </h1>
      <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">
        WangarèLuxe Admin
      </p>
    </div>

    <div
      style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;"
    >
      <h2 style="color: #D4AF37; margin-top: 0;">Contact Form Submission</h2>

      <div
        style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
        <p><strong>Name:</strong> {{from_name}}</p>
        <p><strong>Email:</strong> {{from_email}}</p>
        <p><strong>Phone:</strong> {{phone}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
      </div>

      <div
        style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #333; margin-top: 0;">Message</h3>
        <div
          style="white-space: pre-line; background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;"
        >
          {{message}}
        </div>
      </div>

      <div
        style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="color: #0066cc; margin-top: 0;">Quick Actions</h3>
        <p>
          <a
            href="mailto:{{from_email}}?subject=Re: {{subject}}"
            style="color: #0066cc;"
            >Reply to {{from_name}}</a
          >
        </p>
        <p>
          <a href="https://wangareluxe.com/admin" style="color: #0066cc;"
            >View Admin Dashboard</a
          >
        </p>
      </div>

      <hr
        style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;"
      />

      <p style="font-size: 14px; color: #666;">
        This message was sent from the WangarèLuxe contact form.<br />
        Reply directly to this email to respond to the customer.
      </p>
    </div>
  </body>
</html>
```

## Template Variables Reference

### Order Confirmation Template Variables:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{order_number}}` - Order number
- `{{order_date}}` - Order date
- `{{total_amount}}` - Total amount
- `{{items}}` - Items list
- `{{shipping_address}}` - Shipping address
- `{{tracking_number}}` - Tracking number (optional)
- `{{estimated_delivery}}` - Estimated delivery (optional)

### Payment Confirmed Template Variables:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{order_number}}` - Order number
- `{{payment_amount}}` - Payment amount
- `{{payment_method}}` - Payment method
- `{{payment_date}}` - Payment date

### Payment Failed Template Variables:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{order_number}}` - Order number
- `{{payment_amount}}` - Payment amount
- `{{failure_reason}}` - Failure reason
- `{{retry_url}}` - Retry payment URL

### Welcome Email Template Variables:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{welcome_message}}` - Welcome message
- `{{discount_code}}` - Discount code
- `{{website_url}}` - Website URL

### Contact Form Template Variables:

- `{{from_name}}` - Sender name
- `{{from_email}}` - Sender email
- `{{subject}}` - Subject
- `{{message}}` - Message content
- `{{phone}}` - Phone number (optional)
- `{{admin_email}}` - Admin email
