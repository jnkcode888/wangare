# 🚀 Local Development Guide - WangarèLuxe Email System

Your email system now works both locally and on Vercel! Here's how to run it locally for development.

## ✅ **What I've Set Up:**

### 1. **Local Development Server** (`dev-server.js`)

- Express.js server running on port 3001
- Same API endpoints as Vercel functions
- SMTP configuration with Gmail
- CORS enabled for frontend

### 2. **Vite Proxy Configuration** (`vite.config.ts`)

- Proxies `/api` requests to local server
- Seamless development experience
- No code changes needed

### 3. **Updated Package Scripts**

- `npm run dev` - Frontend only
- `npm run dev:server` - Backend only
- `npm run dev:full` - Both frontend and backend

## 🚀 **How to Run Locally:**

### **Option 1: Run Everything Together (Recommended)**

```bash
# Install dependencies
npm install

# Run both frontend and backend
npm run dev:full
```

This will start:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- API: `http://localhost:3001/api`

### **Option 2: Run Separately**

```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start frontend
npm run dev
```

## 📧 **What Works Locally:**

- ✅ **Contact Form**: Sends emails via local API
- ✅ **Admin Testing**: Test SMTP and send emails
- ✅ **API Endpoints**: All email functions work
- ✅ **Hot Reload**: Frontend updates automatically
- ✅ **Error Handling**: Proper error messages

## 🔧 **API Endpoints (Local):**

- `GET http://localhost:3001/api/health` - Health check
- `GET http://localhost:3001/api/email?action=test-connection` - Test SMTP
- `POST http://localhost:3001/api/email?action=contact` - Contact form
- `POST http://localhost:3001/api/email?action=test` - Test email
- `POST http://localhost:3001/api/email?action=order-confirmation` - Order confirmation

## 🎯 **Testing Steps:**

1. **Start the development environment:**

   ```bash
   npm run dev:full
   ```

2. **Open your browser:**

   - Go to `http://localhost:5173`
   - Navigate to Admin Panel → Settings
   - Test the email system

3. **Test Contact Form:**

   - Go to Contact page
   - Fill out the form
   - Submit and check for success message

4. **Check Email Delivery:**
   - Check `info.wangareluxe@gmail.com` inbox
   - Verify emails are received

## 🚨 **Troubleshooting:**

### **"API server not reachable"**

- Make sure you ran `npm run dev:full`
- Check if port 3001 is available
- Look for server startup messages

### **"SMTP connection failed"**

- Verify Gmail app password is correct
- Check if 2-factor authentication is enabled
- Ensure internet connection

### **"Contact form not working"**

- Check browser console for errors
- Verify both servers are running
- Test API endpoints directly

### **Port Already in Use**

```bash
# Kill process on port 3001
npx kill-port 3001

# Or change port in dev-server.js
const PORT = 3002; // Change this
```

## 🔄 **Development vs Production:**

### **Local Development:**

- Uses `dev-server.js` (Express.js)
- Runs on `localhost:3001`
- Full debugging capabilities
- Hot reload for frontend

### **Production (Vercel):**

- Uses `api/email.js` (Serverless functions)
- Runs on Vercel's infrastructure
- Automatic scaling
- Global CDN

## 🎉 **Benefits of Local Development:**

- ✅ **Fast Development**: No deployment needed
- ✅ **Full Debugging**: Console logs and error details
- ✅ **Hot Reload**: Instant frontend updates
- ✅ **Offline Testing**: Works without internet
- ✅ **Easy Testing**: Test all features locally

## 📝 **Development Workflow:**

1. **Make Changes**: Edit your code
2. **Test Locally**: Use `npm run dev:full`
3. **Verify Everything**: Test all features
4. **Deploy to Vercel**: Push to GitHub
5. **Test Production**: Verify on live site

---

**Your local development environment is now ready! 🚀**

You can develop and test your email system locally before deploying to Vercel. The contact form should work perfectly now!
