import nodemailer from 'nodemailer';

// Test Hostinger SMTP Configuration
const SMTP_CONFIG = {
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false,
  auth: {
    user: 'info@wangareluxe.com',
    pass: process.env.SMTP_PASSWORD || 'your_hostinger_password_here'
  }
};

async function testHostingerSMTP() {
  console.log('🧪 Testing Hostinger SMTP Connection...');
  console.log('📧 Email: info@wangareluxe.com');
  console.log('🌐 Host: smtp.hostinger.com');
  console.log('🔌 Port: 587');
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    
    // Verify connection
    console.log('\n1. 🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Send test email
    console.log('\n2. 📧 Sending test email...');
    const testEmail = {
      from: '"WangarèLuxe Test" <info@wangareluxe.com>',
      to: 'info@wangareluxe.com', // Send to yourself for testing
      subject: 'Hostinger SMTP Test - WangarèLuxe',
      text: `
This is a test email from WangarèLuxe using Hostinger SMTP.

Test Details:
- From: info@wangareluxe.com
- Host: smtp.hostinger.com
- Time: ${new Date().toLocaleString()}

If you receive this email, your Hostinger SMTP is working correctly!

Best regards,
WangarèLuxe Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">Hostinger SMTP Test - WangarèLuxe</h2>
          <p>This is a test email from WangarèLuxe using Hostinger SMTP.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <ul>
              <li><strong>From:</strong> info@wangareluxe.com</li>
              <li><strong>Host:</strong> smtp.hostinger.com</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          
          <p style="color: #28a745; font-weight: bold;">
            ✅ If you receive this email, your Hostinger SMTP is working correctly!
          </p>
          
          <p>Best regards,<br>WangarèLuxe Team</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    
    console.log('\n🎉 Hostinger SMTP is working perfectly!');
    console.log('📋 Next steps:');
    console.log('   1. Check your inbox for the test email');
    console.log('   2. If received, your SMTP is configured correctly');
    console.log('   3. If not received, check spam folder');
    console.log('   4. Verify your Hostinger email password');
    
  } catch (error) {
    console.error('❌ SMTP Test Failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your Hostinger email password');
    console.log('   2. Verify SMTP settings in Hostinger panel');
    console.log('   3. Ensure SMTP is enabled for your account');
    console.log('   4. Check if 2FA is required');
  }
}

// Run the test
testHostingerSMTP();
