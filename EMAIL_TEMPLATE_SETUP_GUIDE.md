# Email Template Setup Guide

## 📧 **Recommended Email Structure**

Yes, you should have **separate templates** for different email flows. Here's the recommended structure:

### **1. Outbound Emails (Site → Customer)**

- **Service**: `outbound_service`
- **Template**: `outbound_template`
- **Purpose**: Send emails TO customers
- **Examples**: Order confirmations, payment notifications, welcome emails

### **2. Inbound Emails (Customer → Site)**

- **Service**: `inbound_service`
- **Template**: `inbound_template`
- **Purpose**: Send notifications TO admin
- **Examples**: Contact form submissions, admin notifications

## 🛠️ **EmailJS Setup Steps**

### **Step 1: Create Two Services**

#### **Service 1: Outbound Service**

1. Go to EmailJS dashboard
2. Create new service: `outbound_service`
3. Configure:
   - **To Email**: `{{to_email}}` (dynamic - customer email)
   - **From Name**: `WangarèLuxe`
   - **From Email**: `info@wangareluxe.com`
   - **Subject**: `{{subject}}`

#### **Service 2: Inbound Service**

1. Create new service: `inbound_service`
2. Configure:
   - **To Email**: `info.wangareluxe@gmail.com` (hardcoded - admin email)
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Subject**: `{{subject}}`

### **Step 2: Create Two Templates**

#### **Template 1: Outbound Template**

1. Create template: `outbound_template`
2. Use the HTML from `src/templates/outboundEmailTemplate.html`
3. Configure variables:
   - `{{to_email}}` - Customer email
   - `{{to_name}}` - Customer name
   - `{{template_type}}` - Type of email
   - `{{order_number}}`, `{{total_amount}}`, etc.

#### **Template 2: Inbound Template**

1. Create template: `inbound_template`
2. Use the HTML from `src/templates/inboundEmailTemplate.html`
3. Configure variables:
   - `{{from_name}}` - Customer name
   - `{{from_email}}` - Customer email
   - `{{subject}}` - Email subject
   - `{{message}}` - Customer message

### **Step 3: Update Environment Variables**

Create or update your `.env` file:

```env
# Outbound emails (Site → Customer)
VITE_EMAILJS_OUTBOUND_KEY=your_outbound_public_key

# Inbound emails (Customer → Site)
VITE_EMAILJS_INBOUND_KEY=your_inbound_public_key

# Legacy (for backward compatibility)
VITE_EMAILJS_PUBLIC_KEY=your_legacy_public_key
```

## 📋 **Email Flow Examples**

### **Outbound Flow (Site → Customer)**

```
Customer places order
↓
Site sends order confirmation
↓
Customer receives email at their email
```

### **Inbound Flow (Customer → Site)**

```
Customer submits contact form
↓
Site sends notification to admin
↓
Admin receives email at info.wangareluxe@gmail.com
```

## 🔧 **Current Issue Fix**

For your current 422 error, you need to:

1. **Fix your existing `master_template` service**:

   - Set **To Email** to: `info.wangareluxe@gmail.com`
   - Set **From Name** to: `{{from_name}}`
   - Set **From Email** to: `{{from_email}}`

2. **OR create the new structure** as described above

## 🚀 **Benefits of Separate Templates**

1. **Better Organization**: Clear separation of email types
2. **Easier Management**: Different templates for different purposes
3. **Better Security**: Separate services for different email flows
4. **Easier Debugging**: Clear distinction between outbound and inbound
5. **Scalability**: Easy to add new email types

## 📞 **Next Steps**

1. **Quick Fix**: Update your existing `master_template` service configuration
2. **Long-term**: Set up the separate service structure
3. **Test**: Verify both outbound and inbound emails work

Would you like me to help you with the quick fix first, or would you prefer to set up the complete separate structure?
