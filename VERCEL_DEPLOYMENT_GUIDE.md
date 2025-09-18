# 🚀 Vercel Deployment Guide for WangarèLuxe

Your WangarèLuxe website is now optimized for Vercel hosting with serverless email functions.

## ✅ **What's Been Set Up:**

### 1. **Vercel Serverless Functions** (`api/` folder)

- `api/email/contact.js` - Contact form emails
- `api/email/test.js` - Test email sending
- `api/email/test-connection.js` - SMTP connection testing
- `api/email/order-confirmation.js` - Order confirmation emails
- `api/health.js` - Health check endpoint

### 2. **Vercel Configuration** (`vercel.json`)

- Function timeout settings (30 seconds)
- Environment variable configuration
- CORS headers for all API routes

### 3. **Updated Frontend** (`src/services/apiEmailService.ts`)

- Uses relative API paths (`/api/...`)
- Works with Vercel's serverless functions
- No localhost dependencies

## 🚀 **Deployment Steps:**

### **Step 1: Install Dependencies**

```bash
npm install
```

### **Step 2: Set Up Environment Variables in Vercel**

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add these variables:**

```
SMTP_USER = info.wangareluxe@gmail.com
SMTP_PASSWORD = tnct athb xxah wbnt
```

### **Step 3: Deploy to Vercel**

**Option A: Using Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Using Git Integration**

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy

### **Step 4: Verify Deployment**

1. **Check your Vercel dashboard** for deployment status
2. **Visit your live site**
3. **Test the contact form**
4. **Check admin panel** for email testing

## 🔧 **API Endpoints (Live URLs):**

Once deployed, your API endpoints will be:

- `https://your-domain.vercel.app/api/health`
- `https://your-domain.vercel.app/api/email/test-connection`
- `https://your-domain.vercel.app/api/email/contact`
- `https://your-domain.vercel.app/api/email/test`
- `https://your-domain.vercel.app/api/email/order-confirmation`

## 📧 **How to Test After Deployment:**

1. **Visit your live website**
2. **Go to Admin Panel** → **Settings** tab
3. **Click "Check API Server"** - should show ✅
4. **Click "Test Connection"** - should verify SMTP
5. **Send a test email** - should work perfectly
6. **Try the contact form** - should send emails to your inbox

## 🛠️ **Configuration Details:**

### **Environment Variables:**

```bash
SMTP_USER=info.wangareluxe@gmail.com
SMTP_PASSWORD=tnct athb xxah wbnt
```

### **Function Timeouts:**

- All email functions: 30 seconds
- Health check: Default (10 seconds)

### **CORS Configuration:**

- All origins allowed (`*`)
- All methods allowed
- All headers allowed

## 🔄 **Development vs Production:**

### **Development:**

- Run `npm run dev` locally
- API calls go to `/api/...` (relative paths)
- Uses local Vercel functions

### **Production:**

- Deployed to Vercel
- API calls go to `https://your-domain.vercel.app/api/...`
- Uses Vercel's serverless infrastructure

## 🚨 **Important Notes:**

1. **Environment Variables**: Must be set in Vercel dashboard
2. **Gmail App Password**: Already configured in the code
3. **CORS**: Enabled for all origins
4. **Timeouts**: 30 seconds for email functions
5. **No Backend Server**: Everything runs on Vercel

## 🎯 **Deployment Checklist:**

- [ ] Code pushed to GitHub
- [ ] Vercel project connected to GitHub
- [ ] Environment variables set in Vercel
- [ ] Deployment successful
- [ ] Contact form tested
- [ ] Admin panel email testing works
- [ ] Emails received in inbox

## 📞 **Troubleshooting:**

### **"API server not reachable"**

- Check if deployment was successful
- Verify environment variables are set
- Check Vercel function logs

### **"SMTP connection failed"**

- Verify Gmail app password is correct
- Check environment variables in Vercel
- Ensure 2-factor authentication is enabled

### **"Contact form not working"**

- Check browser console for errors
- Verify API endpoints are accessible
- Check Vercel function logs

### **Environment Variables Not Working**

- Make sure variables are set in Vercel dashboard
- Redeploy after setting variables
- Check variable names match exactly

## 🎉 **Benefits of Vercel Deployment:**

- ✅ **Serverless**: No server management needed
- ✅ **Automatic Scaling**: Handles traffic spikes
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Easy Deployment**: Git-based deployments
- ✅ **Environment Variables**: Secure configuration
- ✅ **Function Logs**: Easy debugging
- ✅ **Free Tier**: Generous free usage

---

**Your WangarèLuxe website is now ready for Vercel! 🚀**

The email system will work perfectly on Vercel's serverless infrastructure, and you'll have a professional, scalable website.
