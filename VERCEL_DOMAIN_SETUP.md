# 🌐 Vercel Domain Setup Guide for WangarèLuxe

## 🎯 **Goal**

Connect your Hostinger domain `wangareluxe.com` to Vercel hosting while keeping email functionality intact.

## 📋 **Step-by-Step Setup**

### **Step 1: Configure Domain in Vercel**

1. **Access Vercel Dashboard**:

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your WangarèLuxe project

2. **Add Custom Domain**:

   - Click **Settings** → **Domains**
   - Click **Add Domain**
   - Enter: `wangareluxe.com`
   - Click **Add**

3. **Get Vercel DNS Records**:
   - Vercel will show you the required DNS records
   - Note down the IP address (usually `76.76.19.61`)

### **Step 2: Update Hostinger DNS Records**

**In your Hostinger DNS Zone Editor, make these changes:**

#### **A. Update Root Domain (A Record)**

**Current:**

```
A    @    216.198.79.1    300
```

**Change to:**

```
A    @    216.198.79.1     300
```

_(Use the IP address provided by Vercel)_

#### **B. Keep Email Records (Don't Change)**

**Keep these records exactly as they are:**

```
MX    @    5    mx1.hostinger.com    14400
MX    @    10   mx2.hostinger.com    14400
TXT   @    "v=spf1 include:_spf.mail.hostinger.com ~all"    3600
TXT   _dmarc    "v=DMARC1; p=none; rua=mailto:info@wangareluxe.com; ruf=mailto:info@wangareluxe.com; sp=none; aspf=r; adkim=r;"    3600
CNAME hostingermail-c._domainkey    0    hostingermail-c.dkim.mail.hostinger.com    300
CNAME hostingermail-b._domainkey    0    hostingermail-b.dkim.mail.hostinger.com    300
CNAME hostingermail-a._domainkey    0    hostingermail-a.dkim.mail.hostinger.com    300
CNAME autodiscover    0    autodiscover.mail.hostinger.com    300
CNAME autoconfig    0    autoconfig.mail.hostinger.com    300
```

#### **C. Update WWW Subdomain**

**Current:**

```
CNAME    www    d5dabde48e2d33ad.vercel-dns-017.com    300
```

**Change to:**

```
CNAME    www    d5dabde48e2d33ad.vercel-dns-017.com    300
```

### **Step 3: Verify Configuration**

#### **A. Check Domain Propagation**

- Visit [whatsmydns.net](https://www.whatsmydns.net)
- Enter `wangareluxe.com`
- Check A record points to Vercel IP

#### **B. Test Website**

- Visit `https://wangareluxe.com`
- Should load your Vercel-hosted site
- Check `https://www.wangareluxe.com` works too

#### **C. Test Email**

- Send a test email from your site
- Check if emails still work properly

### **Step 4: Update Environment Variables**

**In Vercel Dashboard:**

1. Go to **Settings** → **Environment Variables**
2. Add/Update:
   ```
   SMTP_USER=info@wangareluxe.com
   SMTP_PASSWORD=WangareLuxe888!
   ```

### **Step 5: Deploy and Test**

1. **Deploy to Vercel**:

   - Push your changes to GitHub
   - Vercel will automatically deploy

2. **Test Email System**:
   - Test contact form
   - Test checkout process
   - Verify emails are sent

## 🚨 **Important Notes**

### **Email Will Continue Working Because:**

- ✅ **MX Records**: Point to Hostinger (for receiving emails)
- ✅ **SPF Records**: Authorize Hostinger to send emails
- ✅ **DKIM Records**: Sign emails from Hostinger
- ✅ **DMARC Records**: Control email policy

### **Website Will Work Because:**

- ✅ **A Record**: Points to Vercel (for website hosting)
- ✅ **CNAME www**: Points to Vercel (for www subdomain)

## 📊 **Expected Results**

| Service     | Before          | After           |
| ----------- | --------------- | --------------- |
| **Website** | Hostinger       | Vercel          |
| **Email**   | Hostinger       | Hostinger       |
| **Domain**  | wangareluxe.com | wangareluxe.com |
| **SSL**     | Hostinger       | Vercel          |

## 🔧 **Troubleshooting**

### **Issue 1: Website Not Loading**

- Check A record points to Vercel IP
- Wait 24-48 hours for DNS propagation
- Clear browser cache

### **Issue 2: Emails Not Working**

- Verify MX records still point to Hostinger
- Check SPF, DKIM, DMARC records are intact
- Test SMTP connection

### **Issue 3: SSL Certificate Issues**

- Vercel handles SSL automatically
- Wait for certificate generation (up to 24 hours)

## ⏱️ **Timeline**

- **DNS Propagation**: 24-48 hours
- **SSL Certificate**: Up to 24 hours
- **Full Setup**: 2-3 days

## 🎉 **Benefits After Setup**

- ✅ **Faster Website**: Vercel's global CDN
- ✅ **Better Performance**: Optimized hosting
- ✅ **Automatic SSL**: HTTPS enabled
- ✅ **Email Intact**: All email functionality preserved
- ✅ **Professional Domain**: wangareluxe.com

## 📞 **Need Help?**

1. **Vercel Support**: [vercel.com/help](https://vercel.com/help)
2. **Hostinger Support**: [hpanel.hostinger.com](https://hpanel.hostinger.com)
3. **DNS Check**: [whatsmydns.net](https://www.whatsmydns.net)

**This setup gives you the best of both worlds: Vercel's fast hosting + Hostinger's reliable email!** 🚀
