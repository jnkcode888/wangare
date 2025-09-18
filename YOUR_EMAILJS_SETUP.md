# Your EmailJS Setup - Ready to Go! 🚀

## ✅ **Configuration Updated**

Your EmailJS configuration has been updated with your actual details:

### **Service Details:**

- **Service ID**: `master_template`
- **Public Key**: `mxdbtkddeHLmcEIx7`

### **Template Details:**

- **Outbound Template**: `template_k67t14i` (for customer emails)
- **Inbound Template**: `template_oy3x779` (for admin notifications)

## 🛠️ **Next Steps**

### **Step 1: Configure Your EmailJS Service**

1. Go to your EmailJS dashboard: https://dashboard.emailjs.com/
2. Find your `master_template` service
3. Configure it with these settings:
   - **To Email**: `{{to_email}}` (dynamic)
   - **From Name**: `WangarèLuxe`
   - **From Email**: `info@wangareluxe.com`
   - **Subject**: `{{subject}}`

### **Step 2: Configure Your Templates**

#### **Template 1: `template_k67t14i` (Outbound)**

1. Copy the HTML from `src/templates/outboundEmailTemplate.html`
2. Paste it into your `template_k67t14i` template
3. Make sure these variables are configured:
   - `{{to_email}}` - Customer email
   - `{{to_name}}` - Customer name
   - `{{template_type}}` - Email type
   - `{{order_number}}`, `{{total_amount}}`, etc.

#### **Template 2: `template_oy3x779` (Inbound)**

1. Copy the HTML from `src/templates/inboundEmailTemplate.html`
2. Paste it into your `template_oy3x779` template
3. Make sure these variables are configured:
   - `{{to_email}}` - Admin email (will be set to info.wangareluxe@gmail.com)
   - `{{from_name}}` - Customer name
   - `{{from_email}}` - Customer email
   - `{{subject}}` - Email subject
   - `{{message}}` - Customer message

### **Step 3: Test Your Setup**

1. Go to your admin panel → Settings
2. Use the "Email Testing" section
3. Test both outbound and inbound emails
4. Check your email inboxes

## 🔧 **Current Issue Fix**

The 422 error should be resolved once you:

1. Set your service's **To Email** field to `{{to_email}}`
2. Configure both templates with the correct HTML

## 📧 **How It Works Now**

### **Outbound Emails (Site → Customer)**

- Uses `template_k67t14i`
- `to_email` = customer's email
- `template_type` = specific email type

### **Inbound Emails (Customer → Site)**

- Uses `template_oy3x779`
- `to_email` = info.wangareluxe@gmail.com (hardcoded)
- `template_type` = contact_form or admin_notification

## 🎉 **Ready to Test!**

Your configuration is now set up with your actual EmailJS details. Just configure the service and templates as described above, and your contact form should work perfectly!

**Need help with any step? Just ask!** 🚀
