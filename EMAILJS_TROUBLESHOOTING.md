# EmailJS 422 Error Troubleshooting Guide

## Current Issue: "The recipients address is empty"

This error occurs when EmailJS doesn't know where to send the email. Here are the most common causes and solutions:

## 🔍 Debug Steps

### 1. Check Console Logs

After submitting the contact form, check your browser console for:

```
EmailJS Parameters: {
  serviceId: "master_template",
  templateId: "master_template",
  emailParams: { ... },
  publicKey: "mxdbtkddeHLmcEIx7"
}
```

### 2. Verify EmailJS Service Configuration

The issue is likely in your EmailJS service settings. Here's how to fix it:

#### Option A: Configure Service to Send to Specific Email

1. Go to your EmailJS dashboard: https://dashboard.emailjs.com/
2. Navigate to **Email Services**
3. Click on your `master_template` service
4. In **Service Settings**, set:
   - **To Email**: `info.wangareluxe@gmail.com`
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Subject**: `{{subject}}`

#### Option B: Use Dynamic Recipients

1. In your service settings, enable "Dynamic Recipients"
2. Set the recipient field to use template variables like `{{to_email}}`

### 3. Check Template Configuration

Make sure your `master_template` template has:

- **To Email**: `{{to_email}}` or hardcoded `info.wangareluxe@gmail.com`
- **From Name**: `{{from_name}}`
- **From Email**: `{{from_email}}`
- **Subject**: `{{subject}}`

### 4. Test with Simple Template

Try creating a simple test template to isolate the issue:

1. Create a new template called `test_template`
2. Use this simple HTML:

```html
To: {{to_email}} From: {{from_name}} <{{from_email}}> Subject: {{subject}}
Message: {{message}}
```

3. Test with this template first

## 🛠️ Quick Fixes to Try

### Fix 1: Hardcode Recipient in Service

1. Go to EmailJS dashboard
2. Edit your `master_template` service
3. Set **To Email** to: `info.wangareluxe@gmail.com`
4. Save changes

### Fix 2: Update Template Variables

Make sure your master template uses these exact variable names:

- `{{to_email}}` for recipient
- `{{from_name}}` for sender name
- `{{from_email}}` for sender email
- `{{subject}}` for subject
- `{{message}}` for message content

### Fix 3: Test Service Connection

1. In EmailJS dashboard, go to your service
2. Click "Test Service"
3. Send a test email to verify the service works

## 📧 Expected Behavior

When working correctly:

1. User submits contact form
2. EmailJS sends email to `info.wangareluxe@gmail.com`
3. You receive the contact form notification
4. User sees success message

## 🚨 Common Issues

1. **Service not configured**: Recipient email not set in service settings
2. **Wrong template variables**: Template uses different variable names
3. **Service ID mismatch**: Using wrong service ID
4. **Template ID mismatch**: Using wrong template ID
5. **Public key issues**: Wrong or expired public key

## 📞 Next Steps

1. Check the console logs for the debug information
2. Verify your EmailJS service configuration
3. Test with a simple template first
4. Let me know what the console logs show

The debug logs will help us identify exactly what's being sent to EmailJS and fix the issue.
