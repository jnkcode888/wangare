# One Service, Two Templates Setup Guide

## 🎯 **Simplified Structure**

### **One Service: `wangareluxe_service`**

- Handles all email sending
- Configured to send to different recipients based on template

### **Two Templates:**

1. **`outbound_template`** - For customer emails (Site → Customer)
2. **`inbound_template`** - For admin notifications (Customer → Site)

## 🛠️ **EmailJS Setup Steps**

### **Step 1: Create One Service**

1. Go to EmailJS dashboard: https://dashboard.emailjs.com/
2. Create service: `wangareluxe_service`
3. Configure service settings:
   - **To Email**: `{{to_email}}` (dynamic - will be set by template)
   - **From Name**: `WangarèLuxe`
   - **From Email**: `info@wangareluxe.com`
   - **Subject**: `{{subject}}`

### **Step 2: Create Two Templates**

#### **Template 1: Outbound Template**

1. Create template: `outbound_template`
2. Copy HTML from `src/templates/outboundEmailTemplate.html`
3. Configure variables:
   - `{{to_email}}` - Customer email
   - `{{to_name}}` - Customer name
   - `{{template_type}}` - Type of email
   - `{{order_number}}`, `{{total_amount}}`, etc.

#### **Template 2: Inbound Template**

1. Create template: `inbound_template`
2. Copy HTML from `src/templates/inboundEmailTemplate.html`
3. Configure variables:
   - `{{to_email}}` - Admin email (will be set to info.wangareluxe@gmail.com)
   - `{{from_name}}` - Customer name
   - `{{from_email}}` - Customer email
   - `{{subject}}` - Email subject
   - `{{message}}` - Customer message

### **Step 3: Update Environment Variables**

Create or update your `.env` file:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 📧 **How It Works**

### **Outbound Emails (Site → Customer)**

```
Customer Action → Site Sends Email → Customer Receives
```

- Uses `outbound_template`
- `to_email` = customer's email
- `template_type` = specific email type

### **Inbound Emails (Customer → Site)**

```
Customer Action → Site Sends Notification → Admin Receives
```

- Uses `inbound_template`
- `to_email` = info.wangareluxe@gmail.com (hardcoded)
- `template_type` = contact_form or admin_notification

## 🔧 **Current Issue Fix**

For your immediate 422 error, update your service configuration:

1. **Go to your EmailJS dashboard**
2. **Edit your service**
3. **Set these values:**
   - **To Email**: `{{to_email}}` (dynamic)
   - **From Name**: `WangarèLuxe`
   - **From Email**: `info@wangareluxe.com`
   - **Subject**: `{{subject}}`

## 🚀 **Benefits of This Approach**

1. ✅ **Simpler Setup** - Only one service to configure
2. ✅ **Easier Management** - Two templates for different purposes
3. ✅ **Cost Effective** - One service instead of two
4. ✅ **Flexible** - Can handle both email flows
5. ✅ **Easy Debugging** - Clear separation by template

## 📋 **Testing Checklist**

### **Test Outbound Emails**

- [ ] Order confirmation email
- [ ] Payment confirmed email
- [ ] Payment failed email
- [ ] Welcome email
- [ ] Order shipped email
- [ ] Order delivered email

### **Test Inbound Emails**

- [ ] Contact form submission
- [ ] Admin notification

## 🔍 **Debug Information**

Check your browser console for:

```
EmailJS Parameters: {
  serviceId: "wangareluxe_service",
  templateId: "outbound_template" or "inbound_template",
  emailParams: { ... },
  publicKey: "your_public_key"
}
```

## 📞 **Next Steps**

1. **Create the service**: `wangareluxe_service`
2. **Create the templates**: `outbound_template` and `inbound_template`
3. **Update your environment variable**
4. **Test the contact form**
5. **Test other email types**

This approach is much simpler and will work perfectly for your needs! 🎉
