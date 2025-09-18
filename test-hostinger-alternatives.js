import nodemailer from 'nodemailer';

// Test different Hostinger SMTP configurations
const configurations = [
  {
    name: 'Standard Hostinger SMTP',
    config: {
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: 'info@wangareluxe.com',
        pass: 'WangareLuxe888!'
      }
    }
  },
  {
    name: 'Hostinger SSL',
    config: {
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'info@wangareluxe.com',
        pass: 'WangareLuxe888!'
      }
    }
  },
  {
    name: 'Domain Mail Server',
    config: {
      host: 'mail.wangareluxe.com',
      port: 587,
      secure: false,
      auth: {
        user: 'info@wangareluxe.com',
        pass: 'WangareLuxe888!'
      }
    }
  },
  {
    name: 'Domain Mail Server SSL',
    config: {
      host: 'mail.wangareluxe.com',
      port: 465,
      secure: true,
      auth: {
        user: 'info@wangareluxe.com',
        pass: 'WangareLuxe888!'
      }
    }
  },
  {
    name: 'Alternative Hostinger',
    config: {
      host: 'smtp.titan.email',
      port: 587,
      secure: false,
      auth: {
        user: 'info@wangareluxe.com',
        pass: 'WangareLuxe888!'
      }
    }
  }
];

async function testConfiguration(name, config) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Security: ${config.secure ? 'SSL' : 'TLS'}`);
  
  try {
    const transporter = nodemailer.createTransport(config);
    await transporter.verify();
    console.log(`   ✅ Connection successful!`);
    
    // Try to send a test email
    const testEmail = {
      from: `"WangarèLuxe Test" <info@wangareluxe.com>`,
      to: 'info@wangareluxe.com',
      subject: `SMTP Test - ${name}`,
      text: `This is a test email using ${name} configuration.`
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log(`   ✅ Email sent successfully!`);
    console.log(`   📧 Message ID: ${result.messageId}`);
    return true;
    
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return false;
  }
}

async function testAllConfigurations() {
  console.log('🚀 Testing All Hostinger SMTP Configurations...');
  console.log('📧 Email: info@wangareluxe.com');
  console.log('🔑 Password: WangareLuxe888!');
  
  let successCount = 0;
  
  for (const config of configurations) {
    const success = await testConfiguration(config.name, config.config);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Results: ${successCount}/${configurations.length} configurations worked`);
  
  if (successCount === 0) {
    console.log('\n🚨 All configurations failed. Possible issues:');
    console.log('   1. Email account not created in Hostinger');
    console.log('   2. SMTP not enabled for the account');
    console.log('   3. Wrong password');
    console.log('   4. 2FA enabled (disable it)');
    console.log('   5. Account suspended or restricted');
    console.log('\n💡 Next steps:');
    console.log('   1. Check Hostinger control panel');
    console.log('   2. Verify email account exists');
    console.log('   3. Enable SMTP in email settings');
    console.log('   4. Contact Hostinger support if needed');
  } else {
    console.log('\n🎉 At least one configuration works!');
    console.log('   Use the working configuration in your code.');
  }
}

// Run all tests
testAllConfigurations();
