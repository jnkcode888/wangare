# EmailJS Setup Guide for WangarèLuxe

This guide will help you set up EmailJS for your WangarèLuxe admin panel to send automated emails.

## Prerequisites

- EmailJS account (free at [emailjs.com](https://www.emailjs.com/))
- Email service (Gmail, Outlook, etc.)

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Save your Service ID** (you'll need this later)

## Step 3: Create Email Templates

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Create the following templates with the exact Template IDs:

### Template 1: Order Confirmation

- **Template ID:** `template_order_confirmation`
- **Subject:** Order Confirmation - {{order_number}}
- **Content:** Copy from `src/templates/emailTemplates.md`

### Template 2: Payment Confirmed

- **Template ID:** `template_payment_confirmed`
- **Subject:** Payment Confirmed - {{order_number}}
- **Content:** Copy from `src/templates/emailTemplates.md`

### Template 3: Payment Failed

- **Template ID:** `template_payment_failed`
- **Subject:** Payment Verification Issue - {{order_number}}
- **Content:** Copy from `src/templates/emailTemplates.md`

### Template 4: Welcome Email

- **Template ID:** `template_welcome`
- **Subject:** Welcome to WangarèLuxe!
- **Content:** Copy from `src/templates/emailTemplates.md`

### Template 5: Contact Form

- **Template ID:** `template_contact_form`
- **Subject:** New Contact Form Submission - {{subject}}
- **Content:** Copy from `src/templates/emailTemplates.md`

## Step 4: Get Your Public Key

1. Go to **Account** in your EmailJS dashboard
2. Find your **Public Key** (also called User ID)
3. **Save this key** (you'll need it later)

## Step 5: Configure in Admin Panel

1. Start your development server: `npm run dev`
2. Go to your admin panel: `http://localhost:5173/admin`
3. Click on the **Settings** tab
4. Enter your configuration:
   - **Service ID:** Your EmailJS service ID
   - **Public Key:** Your EmailJS public key
   - **Template IDs:** Use the default values or update if needed
5. Click **Test Connection** to verify your setup
6. Click **Save Configuration**

## Step 6: Test Email Sending

1. Go to the **Orders** tab in your admin panel
2. Create a test order
3. Check if confirmation emails are sent
4. Check your email inbox for the test email

## Template Variables

Each template uses specific variables. Here's what each template expects:

### Order Confirmation Template:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{order_number}}` - Order number
- `{{order_date}}` - Order date
- `{{total_amount}}` - Total amount
- `{{items}}` - Items list
- `{{shipping_address}}` - Shipping address

### Payment Confirmed Template:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{order_number}}` - Order number
- `{{payment_amount}}` - Payment amount
- `{{payment_method}}` - Payment method
- `{{payment_date}}` - Payment date

### Payment Failed Template:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{order_number}}` - Order number
- `{{payment_amount}}` - Payment amount
- `{{failure_reason}}` - Failure reason
- `{{retry_url}}` - Retry payment URL

### Welcome Email Template:

- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{welcome_message}}` - Welcome message
- `{{discount_code}}` - Discount code
- `{{website_url}}` - Website URL

### Contact Form Template:

- `{{from_name}}` - Sender name
- `{{from_email}}` - Sender email
- `{{subject}}` - Subject
- `{{message}}` - Message content
- `{{phone}}` - Phone number (optional)

## Troubleshooting

### Common Issues:

1. **"Service not found" error:**

   - Check your Service ID is correct
   - Ensure the service is active in EmailJS dashboard

2. **"Template not found" error:**

   - Check your Template ID is correct
   - Ensure the template is published in EmailJS dashboard

3. **"Invalid public key" error:**

   - Check your Public Key is correct
   - Ensure it matches your EmailJS account

4. **Emails not sending:**
   - Check your email service is properly configured
   - Verify the email addresses are valid
   - Check EmailJS dashboard for error logs

### Testing Tips:

1. Use the **Test Connection** button in the admin panel
2. Check browser console for error messages
3. Verify all template variables are being passed correctly
4. Test with a real email address you can access

## Production Deployment

When deploying to production:

1. Update the configuration in your production environment
2. Test all email templates thoroughly
3. Monitor email delivery rates
4. Set up email analytics if needed

## Support

If you encounter issues:

1. Check EmailJS documentation: [docs.emailjs.com](https://docs.emailjs.com/)
2. Check browser console for error messages
3. Verify all configuration values are correct
4. Test with a simple template first

## Security Notes

- Never expose your EmailJS credentials in client-side code
- Use environment variables for production
- Regularly rotate your API keys
- Monitor email usage to avoid exceeding limits

---

**Need Help?** Contact the development team or check the EmailJS documentation for more detailed setup instructions.
