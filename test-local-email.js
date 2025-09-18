const nodemailer = require('nodemailer');

// Test SMTP configuration locally
const SMTP_CONFIG = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@wangareluxe.com',
    pass: 'WangareLuxe888!'
  }
};

async function testLocalEmail() {
  console.log('🧪 Testing Email Configuration Locally...\n');

  try {
    // Create transporter
    const transporter = nodemailer.createTransporter(SMTP_CONFIG);

    // Test connection
    console.log('1️⃣ Testing SMTP Connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection successful!');

    // Test sending email
    console.log('\n2️⃣ Testing Email Send...');
    const testMailOptions = {
      from: '"WangarèLuxe Test" <info@wangareluxe.com>',
      to: 'info@wangareluxe.com',
      subject: 'Local Email Test - WangarèLuxe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>Local Email Test</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>This is a test email sent from the local development environment.</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString('en-KE')}</p>
            <p><strong>Status:</strong> ✅ Email system is working correctly!</p>
          </div>
        </div>
      `,
      text: `Local Email Test - This is a test email sent from the local development environment at ${new Date().toLocaleString('en-KE')}. Email system is working correctly!`
    };

    const result = await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);

    console.log('\n🎉 Local email testing completed successfully!');
    console.log('📧 Check info@wangareluxe.com for the test email.');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testLocalEmail();
