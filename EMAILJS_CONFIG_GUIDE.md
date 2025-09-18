# EmailJS Configuration Guide

## Current Issue: 400 Error

The contact form is failing because the EmailJS public key is not configured.

## How to Fix:

### 1. Get Your EmailJS Public Key

1. Go to your EmailJS dashboard: https://dashboard.emailjs.com/
2. Navigate to **Account** > **API Keys**
3. Copy your **Public Key** (it looks like: `user_xxxxxxxxxxxxxxxx`)

### 2. Configure the Public Key

#### Option A: Environment Variable (Recommended)

1. Create a `.env` file in your project root
2. Add this line:

```
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key_here
```

3. Replace `your_actual_public_key_here` with your actual public key

#### Option B: Direct Configuration

1. Open `src/lib/emailjs.ts`
2. Replace `'your_public_key_here'` with your actual public key:

```javascript
PUBLIC_KEY: 'user_xxxxxxxxxxxxxxxx', // Your actual public key
```

### 3. Restart Your Development Server

After making changes, restart your development server:

```bash
npm run dev
```

## Current Configuration:

- **Service ID**: `master_template` ✅
- **Template ID**: `master_template` ✅
- **Public Key**: Needs to be configured ❌

## Test the Contact Form

1. Go to your contact page
2. Fill out the form
3. Submit the form
4. Check your email (info.wangareluxe@gmail.com) for the contact form message

## Troubleshooting:

- **400 Error**: Usually means wrong public key or service ID
- **403 Error**: Usually means template ID is wrong
- **Network Error**: Check your internet connection

Once you configure the public key, the contact form should work perfectly!
