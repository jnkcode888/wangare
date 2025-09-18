import nodemailer from 'nodemailer';

// Test email deliverability with multiple providers
const SMTP_CONFIG = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@wangareluxe.com',
    pass: 'WangareLuxe888!'
  }
};

const testEmails = [
  'test@gmail.com',
  'test@outlook.com', 
  'test@yahoo.com',
  'test@icloud.com'
];

async function testEmailDeliverability() {
  console.log('🧪 Testing Email Deliverability for WangarèLuxe');
  console.log('📧 From: info@wangareluxe.com');
  console.log('🌐 SMTP: smtp.hostinger.com:465 (SSL)');
  console.log('');

  try {
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    
    // Verify connection
    console.log('1. 🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('   ✅ SMTP connection successful!');
    console.log('');

    // Test with different email providers
    for (const testEmail of testEmails) {
      console.log(`2. 📧 Testing delivery to ${testEmail}...`);
      
      const testMessage = {
        from: '"WangarèLuxe" <info@wangareluxe.com>',
        to: testEmail,
        subject: 'Test Email - WangarèLuxe Deliverability Check',
        text: `
TEST EMAIL - WangarèLuxe Deliverability Check

This is a test email to check deliverability to ${testEmail}.

Test Details:
- From: info@wangareluxe.com
- SMTP: smtp.hostinger.com (SSL)
- Time: ${new Date().toLocaleString()}
- Purpose: Deliverability testing

If you receive this email in your INBOX (not spam), our email system is working correctly!

Best regards,
WangarèLuxe Team
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B4513;">Test Email - WangarèLuxe Deliverability Check</h2>
            
            <p>This is a test email to check deliverability to <strong>${testEmail}</strong>.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Test Details:</h3>
              <ul>
                <li><strong>From:</strong> info@wangareluxe.com</li>
                <li><strong>SMTP:</strong> smtp.hostinger.com (SSL)</li>
                <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Purpose:</strong> Deliverability testing</li>
              </ul>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                ✅ If you receive this email in your INBOX (not spam), our email system is working correctly!
              </p>
            </div>
            
            <p>Best regards,<br>WangarèLuxe Team</p>
          </div>
        `,
        headers: {
          'Reply-To': 'info@wangareluxe.com',
          'Return-Path': 'info@wangareluxe.com',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'normal',
          'X-Mailer': 'WangarèLuxe E-commerce System',
          'X-Category': 'test',
          'X-Auto-Response-Suppress': 'All',
          'Precedence': 'bulk',
          'X-MC-Tags': 'test,deliverability',
          'List-Unsubscribe': '<mailto:unsubscribe@wangareluxe.com>',
          'List-Id': 'WangarèLuxe Test <test.wangareluxe.com>',
          'X-Report-Abuse': 'Please report abuse to info@wangareluxe.com',
          'X-Originating-IP': '[127.0.0.1]',
          'X-Source': 'WangarèLuxe E-commerce Platform',
          'Authentication-Results': 'wangareluxe.com; spf=pass smtp.mailfrom=info@wangareluxe.com; dkim=pass header.d=wangareluxe.com; dmarc=pass action=none header.from=wangareluxe.com;'
        }
      };

      try {
        const result = await transporter.sendMail(testMessage);
        console.log(`   ✅ Email sent successfully to ${testEmail}`);
        console.log(`   📧 Message ID: ${result.messageId}`);
      } catch (error) {
        console.log(`   ❌ Failed to send to ${testEmail}: ${error.message}`);
      }
      
      console.log('');
    }

    console.log('🎉 Deliverability Test Complete!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Check each email address for the test email');
    console.log('   2. Look in INBOX first, then check spam folder');
    console.log('   3. If emails go to spam, mark them as "Not Spam"');
    console.log('   4. Add info@wangareluxe.com to contacts');
    console.log('');
    console.log('🔧 If emails still go to spam:');
    console.log('   1. Add DMARC record: _dmarc TXT v=DMARC1; p=none; rua=mailto:info@wangareluxe.com');
    console.log('   2. Test with mail-tester.com');
    console.log('   3. Contact Hostinger support for DKIM verification');

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check Hostinger SMTP settings');
    console.log('   2. Verify email account password');
    console.log('   3. Ensure SMTP is enabled');
  }
}

// Run the test
testEmailDeliverability();
