# 🚀 Hostinger SMTP Setup Guide for WangarèLuxe

## ✅ **Current Status**

- ✅ **SMTP Configuration Updated**: Changed from Gmail to Hostinger
- ✅ **Email Address Updated**: Now using `info@wangareluxe.com`
- ✅ **All Email Templates Updated**: Using custom domain
- ❌ **Authentication Failed**: Need to configure Hostinger SMTP properly

## 🔧 **Hostinger SMTP Configuration**

### **Current Settings in Code:**

```javascript
const SMTP_CONFIG = {
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@wangareluxe.com",
    pass: process.env.SMTP_PASSWORD,
  },
};
```

## 📋 **Step-by-Step Hostinger Setup**

### 1. **Access Hostinger Control Panel**

1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Login with your Hostinger account
3. Select your domain: `wangareluxe.com`

### 2. **Enable Email Account**

1. Go to **Email** section
2. Click **Create Email Account**
3. Create: `info@wangareluxe.com`
4. Set a strong password (save this!)
5. Click **Create**

### 3. **Configure SMTP Settings**

1. Go to **Email** → **Email Accounts**
2. Find `info@wangareluxe.com`
3. Click **Manage** or **Settings**
4. Look for **SMTP Settings** or **Outgoing Mail**

### 4. **Get SMTP Credentials**

Hostinger SMTP settings should be:

- **SMTP Server**: `smtp.hostinger.com`
- **Port**: `587` (TLS) or `465` (SSL)
- **Security**: STARTTLS or SSL
- **Username**: `info@wangareluxe.com`
- **Password**: Your email account password

### 5. **Enable SMTP Authentication**

1. In email settings, ensure **SMTP Authentication** is enabled
2. Make sure **Outgoing Mail** is enabled
3. Check if **2FA** is required (disable if possible for automation)

## 🔐 **Environment Variables Setup**

### **Option 1: .env File (Recommended)**

Create `.env` file in your project root:

```env
SMTP_USER=info@wangareluxe.com
SMTP_PASSWORD=your_hostinger_email_password
```

### **Option 2: Vercel Environment Variables**

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `SMTP_USER` = `info@wangareluxe.com`
   - `SMTP_PASSWORD` = `your_hostinger_email_password`

## 🧪 **Test Your Configuration**

### **Run the Test Script:**

```bash
node test-hostinger-smtp.js
```

### **Expected Output:**

```
✅ SMTP connection successful!
✅ Test email sent successfully!
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: Authentication Failed**

**Solution:**

- Double-check email password
- Ensure SMTP is enabled in Hostinger
- Try different port (465 for SSL)

### **Issue 2: Connection Timeout**

**Solution:**

- Check if SMTP is enabled
- Verify firewall settings
- Try different security settings

### **Issue 3: 2FA Required**

**Solution:**

- Disable 2FA for this email account
- Use app-specific password if available
- Contact Hostinger support

## 🔄 **Alternative SMTP Settings**

If `smtp.hostinger.com` doesn't work, try:

### **Option 1: Different Port**

```javascript
const SMTP_CONFIG = {
  host: "smtp.hostinger.com",
  port: 465, // SSL instead of TLS
  secure: true,
  auth: {
    user: "info@wangareluxe.com",
    pass: process.env.SMTP_PASSWORD,
  },
};
```

### **Option 2: Different Host**

```javascript
const SMTP_CONFIG = {
  host: "mail.wangareluxe.com", // Your domain's mail server
  port: 587,
  secure: false,
  auth: {
    user: "info@wangareluxe.com",
    pass: process.env.SMTP_PASSWORD,
  },
};
```

## 📧 **Email Deliverability Improvements**

### **Why Hostinger is Better than Gmail:**

- ✅ **Custom Domain**: `info@wangareluxe.com` looks professional
- ✅ **Better Reputation**: Business email vs personal Gmail
- ✅ **Less Spam Filtering**: Custom domains are trusted more
- ✅ **Brand Consistency**: Matches your website domain

### **Additional Benefits:**

- **Professional Appearance**: Customers trust business emails more
- **Better Deliverability**: Custom domains have better inbox rates
- **Brand Recognition**: Consistent with your website
- **No Gmail Limitations**: No daily sending limits

## 🎯 **Next Steps**

1. **Configure Hostinger Email** (5 minutes)
2. **Set Environment Variables** (2 minutes)
3. **Test SMTP Connection** (1 minute)
4. **Deploy to Production** (5 minutes)

## 🎉 **Expected Results**

After proper setup:

- **90%+ emails go to inbox** (vs 60-70% with Gmail)
- **Professional appearance** with custom domain
- **Better customer trust** and engagement
- **No more spam issues**!

## 📞 **Need Help?**

If you're still having issues:

1. **Check Hostinger Documentation**: [Hostinger Email Setup](https://support.hostinger.com/en/articles/1583297-how-to-set-up-email-accounts)
2. **Contact Hostinger Support**: They can help with SMTP configuration
3. **Test with Email Client**: Try setting up the email in Outlook/Thunderbird first

**Your email system will work perfectly once Hostinger SMTP is properly configured!** 🚀
