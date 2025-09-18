// Simple test script to verify the API works
const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing WangarèLuxe Email API...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  // Test 2: SMTP Connection
  console.log('\n2. Testing SMTP Connection...');
  try {
    const response = await fetch(`${API_BASE_URL}/email?action=test-connection`);
    const data = await response.json();
    console.log('✅ SMTP Connection:', data);
  } catch (error) {
    console.log('❌ SMTP Connection Failed:', error.message);
  }

  // Test 3: Test Email
  console.log('\n3. Testing Email Send...');
  try {
    const response = await fetch(`${API_BASE_URL}/email?action=test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'info.wangareluxe@gmail.com',
        subject: 'API Test Email',
        message: 'This is a test email from the API system.'
      }),
    });
    const data = await response.json();
    console.log('✅ Test Email:', data);
  } catch (error) {
    console.log('❌ Test Email Failed:', error.message);
  }

  // Test 4: Contact Form
  console.log('\n4. Testing Contact Form...');
  try {
    const response = await fetch(`${API_BASE_URL}/email?action=contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Contact Form',
        message: 'This is a test contact form submission.',
        phone: '+254 700 000 000'
      }),
    });
    const data = await response.json();
    console.log('✅ Contact Form:', data);
  } catch (error) {
    console.log('❌ Contact Form Failed:', error.message);
  }

  console.log('\n🎉 API Testing Complete!');
}

// Run the test
testAPI().catch(console.error);
