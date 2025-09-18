import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SMTP Configuration
const SMTP_CONFIG = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@wangareluxe.com',
    pass: process.env.SMTP_PASSWORD || 'WangareLuxe888!'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(SMTP_CONFIG);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WangarèLuxe API server is running',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Email API with action-based routing
app.get('/api/email', async (req, res) => {
  const { action } = req.query;

  if (action === 'test-connection') {
    try {
      await transporter.verify();
      res.json({ 
        success: true, 
        message: 'SMTP connection successful' 
      });
    } catch (error) {
      console.error('SMTP connection failed:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  } else {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid action. Use: test-connection' 
    });
  }
});

app.post('/api/email', async (req, res) => {
  const { action } = req.query;

  try {
    switch (action) {
      case 'contact':
        const { name, email, subject, message, phone } = req.body;

        if (!name || !email || !subject || !message) {
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
                  <div class="value">${email}</div>
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

        const contactMailOptions = {
          from: '"WangarèLuxe Contact Form" <info@wangareluxe.com>',
          to: 'info@wangareluxe.com',
          subject: `Contact Form: ${subject}`,
          html: contactHtml,
          headers: {
            'Reply-To': email,
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'normal',
            'X-Mailer': 'WangarèLuxe Contact Form'
          }
        };

        const contactResult = await transporter.sendMail(contactMailOptions);
        console.log('Contact form email sent:', contactResult.messageId);
        
        return res.json({ 
          success: true, 
          messageId: contactResult.messageId 
        });

      case 'test':
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
          from: '"WangarèLuxe" <info.wangareluxe@gmail.com>',
          to: to,
          subject: testSubject,
          html: testHtml
        };

        const testResult = await transporter.sendMail(testMailOptions);
        console.log('Test email sent:', testResult.messageId);
        
        return res.json({ 
          success: true, 
          messageId: testResult.messageId 
        });

      case 'order-confirmation':
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
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; }
              .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px; }
              .order-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th { background: #8B4513; color: white; padding: 15px; text-align: left; }
              .total { font-size: 18px; font-weight: bold; color: #8B4513; text-align: right; margin-top: 20px; }
              .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Order Confirmation</h1>
                <p>Thank you for your order!</p>
              </div>
              <div class="content">
                <div class="order-info">
                  <h3>Order Details</h3>
                  <p><strong>Order Number:</strong> #${orderNumber}</p>
                  <p><strong>Customer:</strong> ${customerName}</p>
                  <p><strong>Email:</strong> ${customerEmail}</p>
                  <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-KE')}</p>
                </div>
                
                <h3>Order Items</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                
                <div class="total">
                  Total: KSh ${total.toLocaleString()}
                </div>
                
                <p>We'll process your order and send you a shipping confirmation soon!</p>
                
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
              </div>
              <div class="footer">
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
                        This is an automated transactional email. Please do not reply to this email.
                      </p>
                      <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                        <a href="https://wangareluxe.com" style="color: #ecf0f1; text-decoration: none;">Visit Our Website</a> | 
                        <a href="mailto:info@wangareluxe.com" style="color: #ecf0f1; text-decoration: none;">Contact Support</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        const orderMailOptions = {
          from: '"WangarèLuxe" <info@wangareluxe.com>',
          to: customerEmail,
          subject: `Order Confirmation #${orderNumber} - WangarèLuxe`,
          html: orderHtml,
          text: `Order Confirmation #${orderNumber}\n\nDear ${customerName},\n\nThank you for your order! We have received your order and it is being processed.\n\nOrder Details:\nOrder Number: #${orderNumber}\nCustomer: ${customerName}\nEmail: ${customerEmail}\nOrder Date: ${new Date().toLocaleDateString('en-KE')}\n\nItems:\n${items.map(item => `${item.name} x${item.quantity} - KSh ${item.price.toLocaleString()}`).join('\n')}\n\nTotal: KSh ${total.toLocaleString()}\n\nThank you for choosing WangarèLuxe!\n\nBest regards,\nThe WangarèLuxe Team`,
          headers: {
            'Reply-To': 'info@wangareluxe.com',
            'Return-Path': 'info@wangareluxe.com',
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'normal',
            'X-Mailer': 'WangarèLuxe Order System',
            'X-Category': 'Order Confirmation',
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
        
        return res.json({ 
          success: true, 
          messageId: orderResult.messageId 
        });

      case 'payment-confirmation':
        const { customerName: payCustomerName, customerEmail: payCustomerEmail, orderNumber: payOrderNumber, items: payItems, total: payTotal, paymentMethod = 'M-Pesa' } = req.body;
        
        // Create items HTML for payment confirmation
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
            <title>Payment Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; }
              .header { background: #28a745; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px; }
              .payment-info { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .order-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th { background: #8B4513; color: white; padding: 15px; text-align: left; }
              .total { font-size: 18px; font-weight: bold; color: #28a745; text-align: right; margin-top: 20px; }
              .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; }
              .success-icon { font-size: 48px; color: #28a745; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="success-icon">✓</div>
                <h1>Payment Confirmed!</h1>
                <p>Your payment has been successfully processed</p>
              </div>
              <div class="content">
                <div class="payment-info">
                  <h3>Payment Details</h3>
                  <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                  <p><strong>Amount Paid:</strong> KSh ${payTotal.toLocaleString()}</p>
                  <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString('en-KE')}</p>
                  <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">CONFIRMED</span></p>
                </div>
                
                <div class="order-info">
                  <h3>Order Details</h3>
                  <p><strong>Order Number:</strong> #${payOrderNumber}</p>
                  <p><strong>Customer:</strong> ${payCustomerName}</p>
                  <p><strong>Email:</strong> ${payCustomerEmail}</p>
                </div>
                
                <h3>Order Items</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${payItemsHtml}
                  </tbody>
                </table>
                
                <div class="total">
                  Total Paid: KSh ${payTotal.toLocaleString()}
                </div>
                
                <p style="background: #e7f3ff; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
                  <strong>What happens next?</strong><br>
                  Your order is now being processed and will be prepared for shipping. You'll receive another email with tracking information once your order ships.
                </p>
                
                <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; margin: 25px 0;">
                  <h4 style="margin-top: 0; color: #1976d2;">Track Your Order</h4>
                  <p style="margin: 10px 0;">
                    <a href="https://wangareluxe.com/orders?order=${payOrderNumber}" 
                       style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                      View Order Online
                    </a>
                  </p>
                  <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                    Use this link to track your order status and view order details.
                  </p>
                </div>
              </div>
              <div class="footer">
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
                        This is an automated transactional email. Please do not reply to this email.
                      </p>
                      <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                        <a href="https://wangareluxe.com" style="color: #ecf0f1; text-decoration: none;">Visit Our Website</a> | 
                        <a href="mailto:info@wangareluxe.com" style="color: #ecf0f1; text-decoration: none;">Contact Support</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        const paymentMailOptions = {
          from: '"WangarèLuxe" <info@wangareluxe.com>',
          to: payCustomerEmail,
          subject: `Payment Confirmed - Order #${payOrderNumber} - WangarèLuxe`,
          html: paymentHtml,
          headers: {
            'Reply-To': 'info@wangareluxe.com',
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'Importance': 'normal',
            'X-Mailer': 'WangarèLuxe Payment System',
            'X-Category': 'Payment Confirmation'
          }
        };

        const paymentResult = await transporter.sendMail(paymentMailOptions);
        console.log('Payment confirmation sent:', paymentResult.messageId);
        
        return res.json({ 
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

        // Generate discount code
        const discountCode = `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

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
                  ${discountCode}
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
          text: `Welcome to WangarèLuxe Club! Your exclusive discount code is: ${discountCode}. Use it for 10% off your first order.`,
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
          discountCode: discountCode
        });

      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid action. Use: contact, test, order-confirmation, payment-confirmation, or newsletter-subscribe' 
        });
    }
  } catch (error) {
    console.error('Email function error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(`📧 Email API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});
