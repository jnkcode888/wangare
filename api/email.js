const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

// Supabase Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// SMTP Configuration
const SMTP_CONFIG = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'info@wangareluxe.com',
    pass: process.env.SMTP_PASSWORD || 'WangareLuxe888!'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(SMTP_CONFIG);

module.exports = async function handler(req, res) {
  // Enhanced CORS handling - Set headers first
  const allowedOrigins = [
    'https://www.wangareluxe.com',
    'https://wangareluxe.com',
    'https://wangare.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  const corsOrigin = allowedOrigins.includes(origin) ? origin : '*';
  
  // Set CORS headers immediately
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request received from:', origin);
    res.status(200).json({ 
      message: 'CORS preflight successful',
      origin: origin,
      allowed: allowedOrigins.includes(origin)
    });
    return;
  }

  const { action } = req.query;

  // Debug logging
  console.log('API Request:', {
    method: req.method,
    origin: origin,
    action: action,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type']
    }
  });

  try {
    switch (action) {
      case 'test-connection':
        await transporter.verify();
        return res.status(200).json({ 
          success: true, 
          message: 'SMTP connection successful' 
        });

      case 'contact':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { name, email: contactEmail, subject, message, phone } = req.body;

        if (!name || !contactEmail || !subject || !message) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields' 
          });
        }

        const contactHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; }
              .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #8B4513; margin-bottom: 5px; }
              .value { background: #f9f9f9; padding: 10px; border-radius: 4px; border-left: 4px solid #8B4513; }
              .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
                <p>WangarèLuxe Website</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">${contactEmail}</div>
                </div>
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value">${phone || 'Not provided'}</div>
                </div>
                <div class="field">
                  <div class="label">Subject:</div>
                  <div class="value">${subject}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="field">
                  <div class="label">Submitted:</div>
                  <div class="value">${new Date().toLocaleDateString('en-KE')} at ${new Date().toLocaleTimeString('en-KE')}</div>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from the WangarèLuxe contact form.</p>
                <p>Please respond directly to: ${email}</p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Create text version of the contact email
        const contactText = `
CONTACT FORM SUBMISSION - WangarèLuxe

New message received from: ${name}
Email: ${contactEmail}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

MESSAGE:
${message}

---
This message was sent through the WangarèLuxe contact form.
Reply directly to this email to respond to the customer.
        `;

        const contactMailOptions = {
          from: '"WangarèLuxe Contact Form" <info@wangareluxe.com>',
          to: 'info@wangareluxe.com',
          subject: `Contact Form: ${subject}`,
          html: contactHtml,
          text: contactText,
          headers: {
            'Reply-To': contactEmail,
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'normal',
            'X-Mailer': 'WangarèLuxe Contact Form'
          }
        };

        const contactResult = await transporter.sendMail(contactMailOptions);
        console.log('Contact form email sent:', contactResult.messageId);
        
        return res.status(200).json({ 
          success: true, 
          messageId: contactResult.messageId 
        });

      case 'test':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { to, subject: testSubject, message: testMessage } = req.body;

        if (!to || !testSubject || !testMessage) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields' 
          });
        }

        const testHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1>Test Email from WangarèLuxe</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; line-height: 1.6;">${testMessage}</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Sent at:</strong> ${new Date().toLocaleString('en-KE')}
              </p>
            </div>
          </div>
        `;

        const testMailOptions = {
          from: '"WangarèLuxe" <info@wangareluxe.com>',
          to: to,
          subject: testSubject,
          html: testHtml
        };

        const testResult = await transporter.sendMail(testMailOptions);
        console.log('Test email sent:', testResult.messageId);
        
        return res.status(200).json({ 
          success: true, 
          messageId: testResult.messageId 
        });

      case 'order-confirmation':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { customerName, customerEmail, orderNumber, items, total } = req.body;

        if (!customerName || !customerEmail || !orderNumber || !items || !total) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields' 
          });
        }

        const itemsHtml = items.map(item => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KSh ${item.price.toLocaleString()}</td>
          </tr>
        `).join('');

        const orderHtml = `
          <!DOCTYPE html>
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Order Confirmation - WangarèLuxe</title>
            <!--[if mso]>
            <noscript>
              <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            </noscript>
            <![endif]-->
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: #ffffff; padding: 40px 20px; text-align: center; }
              .content { padding: 40px 30px; }
              .order-info { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #8B4513; }
              .items-table { width: 100%; border-collapse: collapse; margin: 25px 0; background: #ffffff; }
              .items-table th { background: #8B4513; color: #ffffff; padding: 18px 15px; text-align: left; font-weight: 600; }
              .items-table td { padding: 15px; border-bottom: 1px solid #e9ecef; }
              .items-table tr:nth-child(even) { background: #f8f9fa; }
              .total { font-size: 20px; font-weight: bold; color: #8B4513; text-align: right; margin-top: 25px; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 2px solid #8B4513; }
              .footer { background: #2c3e50; color: #ecf0f1; padding: 30px 20px; text-align: center; font-size: 14px; }
              .highlight { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #2196f3; }
              .button { display: inline-block; padding: 12px 24px; background: #8B4513; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
              .button:hover { background: #A0522D; }
              @media only screen and (max-width: 600px) {
                .container { margin: 10px; }
                .content { padding: 20px; }
                .header { padding: 30px 15px; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: 700;">Order Confirmation</h1>
                <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Thank you for choosing WangarèLuxe!</p>
              </div>
              <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName},</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">We are delighted to confirm that we have received your order and it is now being processed. Thank you for your trust in WangarèLuxe for your luxury fashion needs.</p>
                
                <div class="order-info">
                  <h3 style="margin-top: 0; color: #8B4513; font-size: 20px;">Order Details</h3>
                  <p style="margin: 8px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
                  <p style="margin: 8px 0;"><strong>Customer Name:</strong> ${customerName}</p>
                  <p style="margin: 8px 0;"><strong>Email Address:</strong> ${customerEmail}</p>
                  <p style="margin: 8px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                <h3 style="color: #8B4513; font-size: 20px; margin-top: 30px;">Items Ordered</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                
                <div class="total">
                  <strong>Total Amount: KSh ${total.toLocaleString()}</strong>
                </div>
                
                <div class="highlight">
                  <h4 style="margin-top: 0; color: #1976d2;">What happens next?</h4>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>We will verify your M-Pesa payment (usually within 1-2 hours)</li>
                    <li>You will receive a payment confirmation email once verified</li>
                    <li>Your order will be carefully prepared and packaged</li>
                    <li>We will notify you when your order is ready for shipping</li>
                  </ul>
                </div>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; margin: 25px 0;">
                  <h4 style="margin-top: 0; color: #1976d2;">Track Your Order</h4>
                  <p style="margin: 10px 0;">
                    <a href="https://wangareluxe.com/orders?order=${orderNumber}" 
                       style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                      View Order Online
                    </a>
                  </p>
                  <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                    Use this link to track your order status and view order details.
                  </p>
                </div>
                
                <p style="font-size: 16px; margin-top: 30px;">If you have any questions about your order, please don't hesitate to contact us:</p>
                <p style="margin: 10px 0;">
                  📧 Email: <a href="mailto:info@wangareluxe.com" style="color: #8B4513;">info@wangareluxe.com</a><br>
                  📞 Phone: <a href="tel:0112113237" style="color: #8B4513;">0112113237</a>
                </p>
                
                <p style="font-size: 16px; margin-top: 30px;">Thank you for choosing WangarèLuxe for your luxury fashion needs.</p>
                
                <p style="font-size: 16px; margin-top: 20px;">Best regards,<br><strong>The WangarèLuxe Team</strong></p>
              </div>
              <div class="footer">
                <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">WangarèLuxe</p>
                <p style="margin: 0 0 15px 0; opacity: 0.8;">Luxury Fashion & Accessories</p>
                <p style="margin: 0 0 10px 0;">
                  📧 <a href="mailto:info@wangareluxe.com" style="color: #ecf0f1;">info@wangareluxe.com</a> | 
                  📞 <a href="tel:0112113237" style="color: #ecf0f1;">0112113237</a>
                </p>
                <p style="margin: 0; font-size: 12px; opacity: 0.7;">This is an automated transactional email. Please do not reply to this email.</p>
                <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;">
                  <a href="mailto:unsubscribe@wangareluxe.com" style="color: #ecf0f1;">Unsubscribe</a> | 
                  <a href="https://wangareluxe.com" style="color: #ecf0f1;">Visit Our Website</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Create text version of the email
        const orderText = `
ORDER CONFIRMATION - WangarèLuxe

Dear ${customerName},

We have received your order and are processing it. Here are the details:

ORDER INFORMATION
Order Number: #${orderNumber}
Customer Name: ${customerName}
Email Address: ${customerEmail}
Order Date: ${new Date().toLocaleDateString('en-KE')}

ITEMS ORDERED
${items.map(item => `${item.name} x${item.quantity} - KSh ${item.price.toLocaleString()}`).join('\n')}

TOTAL AMOUNT: KSh ${total.toLocaleString()}

WHAT HAPPENS NEXT?
We will verify your payment and prepare your order for shipping. You will receive another email once your payment is confirmed and your order is ready to ship.

If you have any questions about your order, please contact us at info@wangareluxe.com or call us at 0112113237.

Best regards,
The WangarèLuxe Team

---
WangarèLuxe
Luxury Fashion & Accessories
Email: info@wangareluxe.com | Phone: 0112113237
This is an automated message. Please do not reply to this email.
        `;

        const orderMailOptions = {
          from: '"WangarèLuxe" <info@wangareluxe.com>',
          to: customerEmail,
          subject: `Order Confirmation #${orderNumber} - WangarèLuxe`,
          html: orderHtml,
          text: orderText,
          headers: {
            'Reply-To': 'info@wangareluxe.com',
            'Return-Path': 'info@wangareluxe.com',
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'normal',
            'X-Mailer': 'WangarèLuxe E-commerce System',
            'X-Category': 'transactional',
            'X-Entity-Ref-ID': orderNumber,
            'X-Auto-Response-Suppress': 'All',
            'Precedence': 'bulk',
            'X-MC-Tags': 'order-confirmation,transactional',
            'X-MC-Template': 'order-confirmation',
            'List-Unsubscribe': '<mailto:unsubscribe@wangareluxe.com>',
            'List-Id': 'WangarèLuxe Orders <orders.wangareluxe.com>',
            'X-Report-Abuse': 'Please report abuse to info@wangareluxe.com',
            'X-Originating-IP': '[127.0.0.1]',
            'X-Source': 'WangarèLuxe E-commerce Platform',
            'X-Source-Args': 'order-confirmation',
            'X-Source-Dir': 'api/email',
            'X-Entity-Ref-ID': orderNumber,
            'X-Auto-Response-Suppress': 'All',
            'X-MS-Exchange-Organization-AuthAs': 'Internal',
            'X-MS-Exchange-Organization-AuthMechanism': '04',
            'X-MS-Exchange-Organization-AuthSource': 'wangareluxe.com',
            'Authentication-Results': 'wangareluxe.com; spf=pass smtp.mailfrom=info@wangareluxe.com; dkim=pass header.d=wangareluxe.com; dmarc=pass action=none header.from=wangareluxe.com;',
            'ARC-Authentication-Results': 'i=1; wangareluxe.com; spf=pass smtp.mailfrom=info@wangareluxe.com; dkim=pass header.d=wangareluxe.com; dmarc=pass action=none header.from=wangareluxe.com;',
            'X-Forwarded-Host': 'wangareluxe.com',
            'X-Original-Host': 'wangareluxe.com'
          }
        };

        const orderResult = await transporter.sendMail(orderMailOptions);
        console.log('Order confirmation sent:', orderResult.messageId);
        
        return res.status(200).json({ 
          success: true, 
          messageId: orderResult.messageId 
        });

      case 'payment-confirmation':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { customerName: payCustomerName, customerEmail: payCustomerEmail, orderNumber: payOrderNumber, items: payItems, total: payTotal, paymentMethod = 'M-Pesa' } = req.body;

        if (!payCustomerName || !payCustomerEmail || !payOrderNumber || !payItems || !payTotal) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields' 
          });
        }

        const payItemsHtml = payItems.map(item => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KSh ${item.price.toLocaleString()}</td>
          </tr>
        `).join('');

        const paymentHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmed - WangarèLuxe</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { background: #28a745; color: white; padding: 30px 20px; text-align: center; }
              .content { padding: 30px; }
              .payment-info { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
              .order-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th { background: #8B4513; color: white; padding: 15px; text-align: left; }
              .items-table td { padding: 12px; border-bottom: 1px solid #eee; }
              .total { font-size: 18px; font-weight: bold; color: #28a745; text-align: right; margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px; }
              .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 14px; }
              .success-icon { font-size: 48px; color: #28a745; margin-bottom: 10px; }
              .highlight { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="success-icon">✓</div>
                <h1 style="margin: 0; font-size: 28px;">Payment Confirmed</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Your payment has been successfully processed</p>
              </div>
              <div class="content">
                <p>Dear ${payCustomerName},</p>
                
                <p>Great news! Your payment has been confirmed and your order is now being processed.</p>
                
                <div class="payment-info">
                  <h3 style="margin-top: 0;">Payment Information</h3>
                  <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                  <p><strong>Amount Paid:</strong> KSh ${payTotal.toLocaleString()}</p>
                  <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString('en-KE')}</p>
                  <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">CONFIRMED</span></p>
                </div>
                
                <div class="order-info">
                  <h3 style="margin-top: 0;">Order Information</h3>
                  <p><strong>Order Number:</strong> #${payOrderNumber}</p>
                  <p><strong>Customer Name:</strong> ${payCustomerName}</p>
                  <p><strong>Email Address:</strong> ${payCustomerEmail}</p>
                </div>
                
                <h3>Items Ordered</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${payItemsHtml}
                  </tbody>
                </table>
                
                <div class="total">
                  <strong>Total Paid: KSh ${payTotal.toLocaleString()}</strong>
                </div>
                
                <div class="highlight">
                  <p><strong>What happens next?</strong></p>
                  <p>Your order is now being processed and will be prepared for shipping. You will receive another email with tracking information once your order ships.</p>
                </div>
                
                <p>If you have any questions about your order, please contact us at info@wangareluxe.com or call us at 0112113237.</p>
                
                <p>Thank you for choosing WangarèLuxe!</p>
                <p>Best regards,<br>The WangarèLuxe Team</p>
              </div>
              <div class="footer">
                <p><strong>WangarèLuxe</strong><br>Luxury Fashion & Accessories</p>
                <p>Email: info@wangareluxe.com | Phone: 0112113237</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Create text version of the payment email
        const paymentText = `
PAYMENT CONFIRMED - WangarèLuxe

Dear ${payCustomerName},

Great news! Your payment has been confirmed and your order is now being processed.

PAYMENT INFORMATION
Payment Method: ${paymentMethod}
Amount Paid: KSh ${payTotal.toLocaleString()}
Payment Date: ${new Date().toLocaleDateString('en-KE')}
Status: CONFIRMED

ORDER INFORMATION
Order Number: #${payOrderNumber}
Customer Name: ${payCustomerName}
Email Address: ${payCustomerEmail}

ITEMS ORDERED
${payItems.map(item => `${item.name} x${item.quantity} - KSh ${item.price.toLocaleString()}`).join('\n')}

TOTAL PAID: KSh ${payTotal.toLocaleString()}

WHAT HAPPENS NEXT?
Your order is now being processed and will be prepared for shipping. You will receive another email with tracking information once your order ships.

If you have any questions about your order, please contact us at info@wangareluxe.com or call us at 0112113237.

Thank you for choosing WangarèLuxe!

Best regards,
The WangarèLuxe Team

---
WangarèLuxe
Luxury Fashion & Accessories
Email: info@wangareluxe.com | Phone: 0112113237
This is an automated message. Please do not reply to this email.
        `;

        const paymentMailOptions = {
          from: '"WangarèLuxe Orders" <info@wangareluxe.com>',
          to: payCustomerEmail,
          subject: `Payment received for Order #${payOrderNumber} - Processing now!`,
          html: paymentHtml,
          text: paymentText,
          headers: {
            'Reply-To': 'info@wangareluxe.com',
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'normal',
            'X-Mailer': 'WangarèLuxe',
            'X-Category': 'Payment',
            'X-Entity-Ref-ID': payOrderNumber,
            'X-Auto-Response-Suppress': 'All',
            'Precedence': 'bulk',
            'X-MC-Tags': 'payment,transactional',
            'X-MC-Template': 'payment-template',
            'List-Unsubscribe': '<mailto:unsubscribe@wangareluxe.com>',
            'List-Id': 'WangarèLuxe Orders <orders.wangareluxe.com>'
          }
        };

        const paymentResult = await transporter.sendMail(paymentMailOptions);
        console.log('Payment confirmation sent:', paymentResult.messageId);
        
        return res.status(200).json({ 
          success: true, 
          messageId: paymentResult.messageId 
        });

      case 'newsletter-subscribe':
        const { email: subscriberEmail } = req.body;
        
        if (!subscriberEmail) {
          return res.status(400).json({ 
            success: false, 
            error: 'Email is required' 
          });
        }

        try {
          // Check if email already exists
          const { data: existingSubscriber, error: checkError } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .eq('email', subscriberEmail)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking existing subscriber:', checkError);
            return res.status(500).json({ 
              success: false, 
              error: 'Database error' 
            });
          }

          if (existingSubscriber) {
            if (existingSubscriber.is_active) {
              return res.status(400).json({ 
                success: false, 
                error: 'Email is already subscribed' 
              });
            } else {
              // Reactivate subscription
              const { error: updateError } = await supabase
                .from('newsletter_subscribers')
                .update({ 
                  is_active: true,
                  subscribed_at: new Date().toISOString()
                })
                .eq('email', subscriberEmail);

              if (updateError) {
                console.error('Error reactivating subscription:', updateError);
                return res.status(500).json({ 
                  success: false, 
                  error: 'Failed to reactivate subscription' 
                });
              }
            }
          } else {
        // Generate discount code
        const discountCode = `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            // Insert new subscriber
            const { error: insertError } = await supabase
              .from('newsletter_subscribers')
              .insert({
                email: subscriberEmail,
                is_active: true,
                discount_code: discountCode
              });

            if (insertError) {
              console.error('Error inserting subscriber:', insertError);
              return res.status(500).json({ 
                success: false, 
                error: 'Failed to subscribe' 
              });
            }
          }

          // Generate discount code for email (use existing or create new)
          const emailDiscountCode = existingSubscriber?.discount_code || `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create welcome email with discount
        const welcomeSubject = 'Welcome to WangarèLuxe Club - Your Exclusive Discount Awaits';
        const welcomeHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8860B); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to WangarèLuxe Club!</h1>
              <p style="color: #f8f8f8; margin: 10px 0 0 0; font-size: 16px;">You're now part of our exclusive community</p>
            </div>
            
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Thank you for joining us!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                We're thrilled to have you as part of the WangarèLuxe family. As a welcome gift, 
                we're giving you an exclusive discount code to use on your first purchase.
              </p>
              
              <div style="background: #f8f9fa; border: 2px dashed #D4AF37; padding: 20px; text-align: center; margin: 30px 0;">
                <h3 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 18px;">Your Exclusive Discount Code</h3>
                <div style="background: #D4AF37; color: white; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">
                    ${emailDiscountCode}
                </div>
                <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Use this code at checkout for 10% off your first order</p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                You'll receive exclusive updates about:
              </p>
              <ul style="color: #666; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li>New product launches and collections</li>
                <li>Exclusive member-only discounts</li>
                <li>Early access to sales and promotions</li>
                <li>Fashion tips and styling advice</li>
                <li>Behind-the-scenes content</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.wangareluxe.com/products" 
                   style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Shop Now
                </a>
              </div>
            </div>
            
            <div style="background: #2c3e50; color: #ecf0f1; padding: 30px 20px; text-align: center; font-size: 14px;">
              <div style="max-width: 600px; margin: 0 auto;">
                <h3 style="color: #ecf0f1; margin: 0 0 20px 0; font-size: 18px;">WangarèLuxe</h3>
                <p style="margin: 0 0 15px 0; opacity: 0.8;">Luxury Fashion & Accessories</p>
                <div style="margin: 20px 0; line-height: 1.6;">
                  <p style="margin: 5px 0;">
                    📧 <a href="mailto:info@wangareluxe.com" style="color: #ecf0f1; text-decoration: none;">info@wangareluxe.com</a>
                  </p>
                  <p style="margin: 5px 0;">
                    📞 <a href="tel:0112113237" style="color: #ecf0f1; text-decoration: none;">0112113237</a>
                  </p>
                  <p style="margin: 5px 0;">
                    🌐 <a href="https://wangareluxe.com" style="color: #ecf0f1; text-decoration: none;">www.wangareluxe.com</a>
                  </p>
                </div>
                <div style="border-top: 1px solid #34495e; padding-top: 20px; margin-top: 20px;">
                  <p style="margin: 0 0 10px 0; font-size: 12px; opacity: 0.7;">
                    You received this email because you subscribed to WangarèLuxe Club newsletter.
                  </p>
                  <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                    <a href="https://wangareluxe.com" style="color: #ecf0f1; text-decoration: none;">Visit Our Website</a> | 
                    <a href="mailto:info@wangareluxe.com" style="color: #ecf0f1; text-decoration: none;">Contact Support</a> | 
                    <a href="https://www.wangareluxe.com/unsubscribe?email=${subscriberEmail}" style="color: #ecf0f1; text-decoration: none;">Unsubscribe</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;

        const welcomeMailOptions = {
          from: '"WangarèLuxe" <info@wangareluxe.com>',
          to: subscriberEmail,
          subject: welcomeSubject,
          html: welcomeHtml,
            text: `Welcome to WangarèLuxe Club! Your exclusive discount code is: ${emailDiscountCode}. Use it for 10% off your first order.`,
          headers: {
            'Return-Path': 'info@wangareluxe.com',
            'X-Report-Abuse': 'Please report abuse to info@wangareluxe.com',
            'X-Originating-IP': '[127.0.0.1]',
            'X-Source': 'WangarèLuxe Newsletter System',
            'X-Entity-Ref-ID': `newsletter-${Date.now()}`,
            'X-Auto-Response-Suppress': 'All',
            'Precedence': 'bulk',
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'normal',
            'X-Mailer': 'WangarèLuxe Newsletter System',
            'X-Category': 'newsletter',
            'X-MC-Tags': 'newsletter,welcome',
            'X-MC-Template': 'newsletter-welcome',
            'List-Unsubscribe': '<mailto:unsubscribe@wangareluxe.com>',
            'List-Id': 'WangarèLuxe Newsletter <newsletter.wangareluxe.com>',
            'X-MS-Exchange-Organization-AuthAs': 'Internal',
            'X-MS-Exchange-Organization-AuthMechanism': '04',
            'X-MS-Exchange-Organization-AuthSource': 'wangareluxe.com',
            'Authentication-Results': 'wangareluxe.com; spf=pass smtp.mailfrom=info@wangareluxe.com; dkim=pass header.d=wangareluxe.com; dmarc=pass action=none header.from=wangareluxe.com;',
            'ARC-Authentication-Results': 'i=1; wangareluxe.com; spf=pass smtp.mailfrom=info@wangareluxe.com; dkim=pass header.d=wangareluxe.com; dmarc=pass action=none header.from=wangareluxe.com;',
            'X-Forwarded-Host': 'wangareluxe.com',
            'X-Original-Host': 'wangareluxe.com'
          }
        };

        const welcomeResult = await transporter.sendMail(welcomeMailOptions);
        console.log('Welcome email sent:', welcomeResult.messageId);
        
        return res.status(200).json({ 
          success: true, 
          messageId: welcomeResult.messageId,
            discountCode: emailDiscountCode
          });

        } catch (error) {
          console.error('Newsletter subscription error:', error);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to process subscription' 
          });
        }

      case 'new-product-notification':
        const { product, discountCode: productDiscountCode, discountPercentage = 15 } = req.body;
        
        if (!product) {
          return res.status(400).json({ 
            success: false, 
            error: 'Product data is required' 
          });
        }

        // Generate discount code for new product
        const newProductDiscountCode = productDiscountCode || `NEW${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create new product notification email
        const productSubject = `🆕 New Arrival: ${product.name} - Exclusive ${discountPercentage}% Off!`;
        const productHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8860B); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🆕 New Arrival!</h1>
              <p style="color: #f8f8f8; margin: 10px 0 0 0; font-size: 16px;">Exclusive early access for WangarèLuxe Club members</p>
            </div>
            
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">${product.name}</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                ${product.description || 'Discover our latest addition to the collection.'}
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <img src="${product.image_url}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              </div>
              
              <div style="background: #f8f9fa; border: 2px dashed #D4AF37; padding: 20px; text-align: center; margin: 30px 0;">
                <h3 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 18px;">Exclusive Member Discount</h3>
                <div style="background: #D4AF37; color: white; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">
                  ${newProductDiscountCode}
                </div>
                <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Use this code for ${discountPercentage}% off this new arrival</p>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Regular Price</p>
                  <p style="margin: 0; color: #999; text-decoration: line-through; font-size: 18px;">KES ${product.price.toLocaleString()}</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #D4AF37; font-size: 14px; font-weight: bold;">Member Price</p>
                  <p style="margin: 0; color: #D4AF37; font-size: 24px; font-weight: bold;">KES ${Math.round(product.price * (1 - discountPercentage / 100)).toLocaleString()}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.wangareluxe.com/products/${product.id}" 
                   style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Shop Now - Limited Time!
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px; text-align: center;">
                This exclusive offer is only available to WangarèLuxe Club members. 
                Don't miss out on this limited-time discount!
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                You received this email because you're a member of WangarèLuxe Club.<br>
                <a href="https://www.wangareluxe.com/unsubscribe" style="color: #D4AF37;">Unsubscribe</a>
              </p>
            </div>
          </div>
        `;

        const productMailOptions = {
          from: '"WangarèLuxe" <info@wangareluxe.com>',
          to: 'info@wangareluxe.com', // This will be replaced with actual subscriber emails
          subject: productSubject,
          html: productHtml,
          text: `New Arrival: ${product.name} - Get ${discountPercentage}% off with code ${newProductDiscountCode}. Shop now at https://www.wangareluxe.com/products/${product.id}`,
          headers: {
            'Return-Path': 'info@wangareluxe.com',
            'X-Report-Abuse': 'Please report abuse to info@wangareluxe.com',
            'X-Originating-IP': '[127.0.0.1]',
            'X-Source': 'WangarèLuxe Newsletter System',
            'X-Entity-Ref-ID': `product-${product.id}-${Date.now()}`,
            'X-Auto-Response-Suppress': 'All',
            'Precedence': 'bulk',
            'X-MC-Tags': 'newsletter,product,new-arrival',
            'X-MC-Template': 'product-notification-template',
            'List-Unsubscribe': '<mailto:unsubscribe@wangareluxe.com>',
            'List-Id': 'WangarèLuxe Newsletter <newsletter.wangareluxe.com>'
          }
        };

        // For now, just return success - in production, this would send to all subscribers
        console.log('New product notification prepared:', product.name);
        
        return res.status(200).json({ 
          success: true, 
          message: 'Product notification prepared',
          discountCode: newProductDiscountCode
        });

      case 'bulk-product-notification':
        const { product: bulkProduct, discountCode: bulkDiscountCode, discountPercentage: bulkDiscountPercentage = 15, subscriberEmails } = req.body;
        
        if (!bulkProduct || !subscriberEmails || !Array.isArray(subscriberEmails)) {
          return res.status(400).json({ 
            success: false, 
            error: 'Product data and subscriber emails are required' 
          });
        }

        // Generate discount code for bulk notification
        const bulkDiscountCode = bulkDiscountCode || `NEW${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create the same email template as above
        const bulkProductSubject = `🆕 New Arrival: ${bulkProduct.name} - Exclusive ${bulkDiscountPercentage}% Off!`;
        const bulkProductHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8860B); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🆕 New Arrival!</h1>
              <p style="color: #f8f8f8; margin: 10px 0 0 0; font-size: 16px;">Exclusive early access for WangarèLuxe Club members</p>
            </div>
            
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">${bulkProduct.name}</h2>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                ${bulkProduct.description || 'Discover our latest addition to the collection.'}
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <img src="${bulkProduct.image_url}" alt="${bulkProduct.name}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              </div>
              
              <div style="background: #f8f9fa; border: 2px dashed #D4AF37; padding: 20px; text-align: center; margin: 30px 0;">
                <h3 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 18px;">Exclusive Member Discount</h3>
                <div style="background: #D4AF37; color: white; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">
                  ${bulkDiscountCode}
                </div>
                <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Use this code for ${bulkDiscountPercentage}% off this new arrival</p>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Regular Price</p>
                  <p style="margin: 0; color: #999; text-decoration: line-through; font-size: 18px;">KES ${bulkProduct.price.toLocaleString()}</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #D4AF37; font-size: 14px; font-weight: bold;">Member Price</p>
                  <p style="margin: 0; color: #D4AF37; font-size: 24px; font-weight: bold;">KES ${Math.round(bulkProduct.price * (1 - bulkDiscountPercentage / 100)).toLocaleString()}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.wangareluxe.com/products/${bulkProduct.id}" 
                   style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Shop Now - Limited Time!
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px; text-align: center;">
                This exclusive offer is only available to WangarèLuxe Club members. 
                Don't miss out on this limited-time discount!
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                You received this email because you're a member of WangarèLuxe Club.<br>
                <a href="https://www.wangareluxe.com/unsubscribe" style="color: #D4AF37;">Unsubscribe</a>
              </p>
            </div>
          </div>
        `;

        // Send to all subscribers
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const subscriberEmail of subscriberEmails) {
          try {
            const bulkMailOptions = {
              ...productMailOptions,
              to: subscriberEmail,
              subject: bulkProductSubject,
              html: bulkProductHtml,
              text: `New Arrival: ${bulkProduct.name} - Get ${bulkDiscountPercentage}% off with code ${bulkDiscountCode}. Shop now at https://www.wangareluxe.com/products/${bulkProduct.id}`
            };

            const result = await transporter.sendMail(bulkMailOptions);
            console.log(`Product notification sent to ${subscriberEmail}:`, result.messageId);
            successCount++;
          } catch (error) {
            console.error(`Failed to send to ${subscriberEmail}:`, error);
            errorCount++;
            errors.push({ email: subscriberEmail, error: error.message });
          }
        }

        return res.status(200).json({ 
          success: true, 
          message: `Product notifications sent to ${successCount} subscribers`,
          successCount,
          errorCount,
          errors: errors.length > 0 ? errors : undefined,
          discountCode: bulkDiscountCode
        });

      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid action. Use: test-connection, contact, test, order-confirmation, payment-confirmation, or newsletter-subscribe' 
        });
    }
  } catch (error) {
    console.error('Email function error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
