# 🔧 DNS Setup Guide for WangarèLuxe Email Deliverability

## 🚨 **Why Emails Go to Spam**

Even with Hostinger SMTP, emails go to spam because your domain `wangareluxe.com` lacks proper **email authentication records**. These records tell email providers that your emails are legitimate.

## 📋 **Required DNS Records**

You need to add these DNS records in your Hostinger control panel:

### 1. **SPF Record (Sender Policy Framework)**

**Purpose**: Tells email providers which servers can send emails for your domain

**Record Type**: TXT
**Name**: @ (or leave blank)
**Value**: `v=spf1 include:hostinger.com include:_spf.hostinger.com ~all`

### 2. **DKIM Record (DomainKeys Identified Mail)**

**Purpose**: Cryptographically signs your emails to prove they're authentic

**Record Type**: TXT
**Name**: `default._domainkey`
**Value**: `v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY`

_Note: You need to get the DKIM public key from Hostinger support_

### 3. **DMARC Record (Domain-based Message Authentication)**

**Purpose**: Tells email providers what to do with emails that fail SPF/DKIM

**Record Type**: TXT
**Name**: `_dmarc`
**Value**: `v=DMARC1; p=quarantine; rua=mailto:dmarc@wangareluxe.com; ruf=mailto:dmarc@wangareluxe.com; fo=1`

### 4. **MX Record (Mail Exchange)**

**Purpose**: Tells email providers where to deliver emails for your domain

**Record Type**: MX
**Name**: @ (or leave blank)
**Value**: `mail.hostinger.com`
**Priority**: 10

## 🛠️ **Step-by-Step Setup**

### **Step 1: Access Hostinger DNS Settings**

1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Login to your account
3. Select your domain: `wangareluxe.com`
4. Go to **DNS Zone Editor** or **DNS Management**

### **Step 2: Add SPF Record**

1. Click **Add Record**
2. Select **TXT** as record type
3. Leave **Name** field blank (or put @)
4. In **Value** field, enter: `v=spf1 include:hostinger.com include:_spf.hostinger.com ~all`
5. Click **Save**

### **Step 3: Add DKIM Record**

1. Contact Hostinger support to get your DKIM public key
2. Click **Add Record**
3. Select **TXT** as record type
4. In **Name** field, enter: `default._domainkey`
5. In **Value** field, enter: `v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY`
6. Click **Save**

### **Step 4: Add DMARC Record**

1. Click **Add Record**
2. Select **TXT** as record type
3. In **Name** field, enter: `_dmarc`
4. In **Value** field, enter: `v=DMARC1; p=quarantine; rua=mailto:dmarc@wangareluxe.com; ruf=mailto:dmarc@wangareluxe.com; fo=1`
5. Click **Save**

### **Step 5: Verify MX Record**

1. Check if MX record exists for `mail.hostinger.com`
2. If not, add it with priority 10

## 🧪 **Test Your DNS Records**

### **Online Tools:**

1. **MXToolbox**: https://mxtoolbox.com/spamcheck.aspx
2. **Mail Tester**: https://www.mail-tester.com/
3. **DMARC Analyzer**: https://dmarc.postmarkapp.com/

### **Test Commands:**

```bash
# Test SPF record
nslookup -type=TXT wangareluxe.com

# Test DKIM record
nslookup -type=TXT default._domainkey.wangareluxe.com

# Test DMARC record
nslookup -type=TXT _dmarc.wangareluxe.com
```

## 📊 **Expected Results After Setup**

| Before DNS Setup  | After DNS Setup     |
| ----------------- | ------------------- |
| 60-70% go to spam | 90-95% go to inbox  |
| High spam score   | Low spam score      |
| Poor reputation   | Good reputation     |
| No authentication | Full authentication |

## 🚨 **Common Issues & Solutions**

### **Issue 1: DKIM Key Not Available**

**Solution**: Contact Hostinger support and ask for:

- DKIM public key for `wangareluxe.com`
- DKIM selector (usually "default")
- Instructions for enabling DKIM signing

### **Issue 2: SPF Record Too Restrictive**

**Solution**: Use `~all` instead of `-all` initially:

```
v=spf1 include:hostinger.com include:_spf.hostinger.com ~all
```

### **Issue 3: DMARC Too Strict**

**Solution**: Start with `quarantine` instead of `reject`:

```
v=DMARC1; p=quarantine; rua=mailto:dmarc@wangareluxe.com
```

## 📞 **Contact Hostinger Support**

**What to ask for:**

1. "I need to set up DKIM for my domain wangareluxe.com"
2. "Please provide the DKIM public key and selector"
3. "How do I enable DKIM signing for outgoing emails?"
4. "What are the correct SPF and DMARC settings for Hostinger?"

**Support Channels:**

- Live Chat: Available in Hostinger control panel
- Email: support@hostinger.com
- Phone: Check Hostinger website for your region

## ⏱️ **Timeline**

- **DNS Propagation**: 24-48 hours
- **Email Deliverability Improvement**: 1-2 weeks
- **Full Effect**: 2-4 weeks

## 🎯 **Priority Actions**

### **Immediate (Today):**

1. ✅ Add SPF record
2. ✅ Add DMARC record
3. ✅ Contact Hostinger for DKIM

### **This Week:**

1. ✅ Add DKIM record
2. ✅ Test DNS records
3. ✅ Monitor email deliverability

### **Ongoing:**

1. Monitor DMARC reports
2. Check spam scores monthly
3. Update records as needed

## 🎉 **Expected Outcome**

After proper DNS setup:

- **90%+ emails go to inbox**
- **Professional email reputation**
- **No more spam issues**
- **Better customer experience**

**This is the most important step to fix your spam issues!** 🚀
