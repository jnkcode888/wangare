# Complete Separate Email Structure Setup

## 🎯 **Structure Overview**

### **Outbound Emails (Site → Customer)**

- **Service**: `outbound_service`
- **Template**: `outbound_template`
- **Purpose**: Send emails TO customers
- **Examples**: Order confirmations, payment notifications, welcome emails

### **Inbound Emails (Customer → Site)**

- **Service**: `inbound_service`
- **Template**: `inbound_template`
- **Purpose**: Send notifications TO admin
- **Examples**: Contact form submissions, admin notifications

## 🛠️ **EmailJS Setup Steps**

### **Step 1: Create Two Services in EmailJS**

#### **Service 1: Outbound Service**

1. Go to EmailJS dashboard: https://dashboard.emailjs.com/
2. Create new service: `outbound_service`
3. Configure service settings:
   - **To Email**: `{{to_email}}` (dynamic - customer email)
   - **From Name**: `WangarèLuxe`
   - **From Email**: `info@wangareluxe.com`
   - **Subject**: `{{subject}}`

#### **Service 2: Inbound Service**

1. Create new service: `inbound_service`
2. Configure service settings:
   - **To Email**: `info.wangareluxe@gmail.com` (hardcoded - admin email)
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Subject**: `{{subject}}`

### **Step 2: Create Two Templates in EmailJS**

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

## 📧 **Email Flow Examples**

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

For your immediate 422 error, you have two options:

### **Option 1: Quick Fix (Use Existing Service)**

1. Go to your EmailJS dashboard
2. Edit your `master_template` service
3. Set these values:
   - **To Email**: `info.wangareluxe@gmail.com` (hardcoded)
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Subject**: `{{subject}}`

### **Option 2: Complete Setup (Recommended)**

1. Create the two new services as described above
2. Create the two new templates as described above
3. Update your environment variables
4. Test both outbound and inbound emails

## 🚀 **Benefits of Separate Structure**

1. **Better Organization**: Clear separation of email types
2. **Easier Management**: Different templates for different purposes
3. **Better Security**: Separate services for different email flows
4. **Easier Debugging**: Clear distinction between outbound and inbound
5. **Scalability**: Easy to add new email types
6. **Professional**: Industry best practice

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
- [ ] System alerts

## 🔍 **Debug Information**

The code now includes debug logging. Check your browser console for:

```
EmailJS Parameters: {
  serviceId: "outbound_service" or "inbound_service",
  templateId: "outbound_template" or "inbound_template",
  emailParams: { ... },
  publicKey: "your_public_key"
}
```

## 📞 **Next Steps**

1. **Choose your approach**: Quick fix or complete setup
2. **Set up EmailJS services and templates**
3. **Update environment variables**
4. **Test the contact form**
5. **Test other email types**

The separate structure is now fully implemented in the code. You just need to set up the EmailJS services and templates as described above.

Would you like me to help you with any specific step?
