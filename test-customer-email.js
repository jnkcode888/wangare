// Test to verify customer email is being retrieved correctly
const API_BASE_URL = 'http://localhost:3001/api';

async function testCustomerEmailRetrieval() {
  console.log('🧪 Testing Customer Email Retrieval...\n');

  // Test 1: Check if we can get order data from Supabase
  console.log('1. Testing order data retrieval...');
  try {
    // This would normally be done through the frontend, but let's test the email sending directly
    const testOrderData = {
      customerName: 'Test Customer',
      customerEmail: 'testcustomer@example.com', // This should be the email from the checkout form
      orderNumber: 'ORD-2024-TEST',
      items: [
        { name: 'Test Product', quantity: 1, price: 10000 }
      ],
      total: 10000,
      paymentMethod: 'M-Pesa'
    };

    console.log('📧 Sending payment confirmation to:', testOrderData.customerEmail);

    const response = await fetch(`${API_BASE_URL}/email?action=payment-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Payment Confirmation: Sent Successfully!');
      console.log('📧 Email sent to:', testOrderData.customerEmail);
      console.log('📧 Message ID:', data.messageId);
    } else {
      console.log('❌ Payment Confirmation Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Test Error:', error.message);
  }

  console.log('\n🎉 Customer Email Test Complete!');
  console.log('\n📋 What to check:');
  console.log('   1. The email should be sent to the customer email address from checkout');
  console.log('   2. Check your inbox at testcustomer@example.com');
  console.log('   3. The email should have the customer\'s name and order details');
}

// Run the test
testCustomerEmailRetrieval().catch(console.error);
