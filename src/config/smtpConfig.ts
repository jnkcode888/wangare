// SMTP Configuration
export const SMTP_CONFIG = {
  // Gmail SMTP Settings
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'info@wangareluxe.com',
    pass: 'tnct athb xxah wbnt' // Gmail App Password
  }
};

// Email Settings
export const EMAIL_SETTINGS = {
  adminEmail: 'info@wangareluxe.com',
  fromEmail: 'info@wangareluxe.com',
  fromName: 'WangarèLuxe'
};

// Instructions for environment variables (create .env file manually):
/*
Create a .env file in your project root with:

# SMTP Configuration
VITE_SMTP_USER=info@wangareluxe.com
VITE_SMTP_PASSWORD=tnct athb xxah wbnt
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587

# Email Settings
VITE_ADMIN_EMAIL=info@wangareluxe.com
VITE_FROM_EMAIL=info@wangareluxe.com
VITE_FROM_NAME=WangarèLuxe
*/
