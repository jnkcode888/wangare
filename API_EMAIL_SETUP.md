# 🚀 API-Based Email System Setup

Your WangarèLuxe website now uses a proper backend API for email functionality. This fixes the browser compatibility issues with Nodemailer.

## ✅ **What's Been Set Up:**

### 1. **Backend API Server** (`backend/server.js`)

- Express.js server running on port 3001
- SMTP configuration with Gmail
- Email endpoints for contact form, test emails, and order confirmations
- CORS enabled for frontend communication

### 2. **Frontend API Service** (`src/services/apiEmailService.ts`)

- Clean API calls to backend endpoints
- Error handling and response management
- No direct SMTP dependencies in frontend

### 3. **Updated Contact Form** (`src/pages/ContactPage.tsx`)

- Now uses API service instead of direct SMTP
- Same user experience, better reliability

### 4. **API Test Component** (`src/components/APITestComponent.tsx`)

- Test API server connectivity
- Test SMTP connection through API
- Send test emails and contact form tests

## 🚀 **How to Start the System:**

### **Step 1: Install Backend Dependencies**

```bash
cd backend
npm install
```

### **Step 2: Start the Backend Server**

```bash
cd backend
npm start
```

The server will run on `http://localhost:3001`

### **Step 3: Start the Frontend**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 **API Endpoints:**

- `GET /api/health` - Check if API server is running
- `GET /api/email/test-connection` - Test SMTP connection
- `POST /api/email/contact` - Send contact form email
- `POST /api/email/test` - Send test email
- `POST /api/email/order-confirmation` - Send order confirmation

## 📧 **How to Test:**

1. **Start both servers** (backend and frontend)
2. **Go to Admin Panel** → **Settings** tab
3. **Click "Check API Server"** to verify backend is running
4. **Click "Test Connection"** to verify SMTP works
5. **Send a test email** to verify functionality
6. **Try the contact form** on your website

## 🛠️ **Configuration:**

### **Backend Configuration** (`backend/server.js`):

```javascript
const SMTP_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "info.wangareluxe@gmail.com",
    pass: "tnct athb xxah wbnt", // Your Gmail App Password
  },
};
```

### **Frontend Configuration** (`src/services/apiEmailService.ts`):

```typescript
const API_BASE_URL = "http://localhost:3001/api";
```

## 🔄 **Development vs Production:**

### **Development:**

- Backend runs on `localhost:3001`
- Frontend runs on `localhost:5173`
- Both servers need to be running

### **Production:**

- Deploy backend to a server (Heroku, DigitalOcean, etc.)
- Update `API_BASE_URL` to your production backend URL
- Deploy frontend to your hosting service

## 🚨 **Important Notes:**

1. **Both servers must run**: Frontend and backend need to be running simultaneously
2. **CORS enabled**: Backend allows frontend requests
3. **Gmail App Password**: Your app password is configured in the backend
4. **Port 3001**: Backend uses port 3001, frontend uses port 5173

## 🎯 **Next Steps:**

1. **Install backend dependencies**: `cd backend && npm install`
2. **Start backend server**: `cd backend && npm start`
3. **Start frontend**: `npm run dev`
4. **Test the system** using the admin panel
5. **Verify contact form** works on your website

## 📞 **Troubleshooting:**

### **"API server not reachable"**

- Make sure backend server is running on port 3001
- Check if port 3001 is available

### **"SMTP connection failed"**

- Verify Gmail app password is correct
- Check if 2-factor authentication is enabled

### **"Contact form not working"**

- Ensure both servers are running
- Check browser console for errors
- Verify API endpoints are accessible

---

**Your API-based email system is now ready! 🎉**

This setup is much more reliable and follows proper web development practices with a separate backend API for email functionality.
