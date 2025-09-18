// Test Payment Confirmation Email
const API_BASE_URL = 'http://localhost:3001/api';

async function testPaymentConfirmation() {
  console.log('🧪 Testing Payment Confirmation Email...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/email?action=payment-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: 'John Doe',
        customerEmail: 'customer@example.com',
        orderNumber: 'ORD-2024-001',
        items: [
          { name: 'Luxury Handbag', quantity: 1, price: 15000 },
          { name: 'Designer Shoes', quantity: 2, price: 8000 }
        ],
        total: 31000,
        paymentMethod: 'M-Pesa'
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Payment Confirmation Email: Sent Successfully!');
      console.log('📧 Message ID:', data.messageId);
      console.log('📧 Check customer@example.com for the payment confirmation email');
    } else {
      console.log('❌ Payment Confirmation Email Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Payment Confirmation Email Error:', error.message);
  }

  console.log('\n🎉 Payment Confirmation Test Complete!');
}

// Run the test
testPaymentConfirmation().catch(console.error);
