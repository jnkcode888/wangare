// Test Checkout Email Process
const API_BASE_URL = 'http://localhost:3001/api';

async function testCheckoutEmail() {
  console.log('🧪 Testing Checkout Email Process...\n');

  // Simulate a real customer checkout
  const customerData = {
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    orderNumber: 'WLX-2024-00124',
    items: [
      { name: 'Luxury Handbag', quantity: 1, price: 15000 },
      { name: 'Designer Shoes', quantity: 2, price: 8000 }
    ],
    total: 31000
  };

  console.log('👤 Customer Checkout:');
  console.log(`   Name: ${customerData.customerName}`);
  console.log(`   Email: ${customerData.customerEmail}`);
  console.log(`   Order: ${customerData.orderNumber}`);

  // Test Order Confirmation Email (sent during checkout)
  console.log('\n📧 Testing Order Confirmation Email...');
  try {
    const response = await fetch(`${API_BASE_URL}/email?action=order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Order Confirmation: Sent Successfully!');
      console.log(`📧 Email sent to: ${customerData.customerEmail}`);
      console.log(`📧 Message ID: ${data.messageId}`);
    } else {
      console.log('❌ Order Confirmation Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Order Confirmation Error:', error.message);
  }

  console.log('\n🎉 Checkout Email Test Complete!');
  console.log('\n📋 What to check:');
  console.log(`   • Check the inbox for: ${customerData.customerEmail}`);
  console.log('   • Look for "Order Confirmation" email with brown header');
  console.log('   • Email should contain order details and items');
  console.log('\n🔍 If no email received:');
  console.log('   1. Check spam/junk folder');
  console.log('   2. Check browser console for errors');
  console.log('   3. Verify the email address is correct');
}

// Run the test
testCheckoutEmail().catch(console.error);
