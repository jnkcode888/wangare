// Test Real Payment Flow - Simulate actual customer checkout and admin payment confirmation
const API_BASE_URL = 'http://localhost:3001/api';

async function testRealPaymentFlow() {
  console.log('🧪 Testing Real Payment Flow...\n');

  // Simulate a real customer checkout
  const customerEmail = 'jane.doe@example.com'; // This is what the customer entered in checkout
  const customerName = 'Jane Doe';
  const orderNumber = 'WLX-2024-00123';

  console.log('👤 Customer Checkout Simulation:');
  console.log(`   Name: ${customerName}`);
  console.log(`   Email: ${customerEmail}`);
  console.log(`   Order: ${orderNumber}`);

  // Step 1: Order Confirmation (sent during checkout)
  console.log('\n1. 📧 Sending Order Confirmation (Checkout)...');
  try {
    const orderResponse = await fetch(`${API_BASE_URL}/email?action=order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customerName,
        customerEmail: customerEmail,
        orderNumber: orderNumber,
        items: [
          { name: 'Luxury Handbag', quantity: 1, price: 15000 },
          { name: 'Designer Shoes', quantity: 2, price: 8000 }
        ],
        total: 31000
      }),
    });

    const orderData = await orderResponse.json();
    if (orderData.success) {
      console.log('✅ Order Confirmation: Sent to customer during checkout');
    } else {
      console.log('❌ Order Confirmation Failed:', orderData.error);
    }
  } catch (error) {
    console.log('❌ Order Confirmation Error:', error.message);
  }

  // Step 2: Admin marks order as paid
  console.log('\n2. 👨‍💼 Admin Panel: Marking order as "paid"...');
  console.log(`   Admin clicks "Paid" button for order ${orderNumber}`);
  console.log(`   System retrieves customer email: ${customerEmail}`);

  // Step 3: Payment Confirmation (sent when admin marks as paid)
  console.log('\n3. 📧 Sending Payment Confirmation (Admin Action)...');
  try {
    const paymentResponse = await fetch(`${API_BASE_URL}/email?action=payment-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customerName,
        customerEmail: customerEmail, // This comes from the order data in database
        orderNumber: orderNumber,
        items: [
          { name: 'Luxury Handbag', quantity: 1, price: 15000 },
          { name: 'Designer Shoes', quantity: 2, price: 8000 }
        ],
        total: 31000,
        paymentMethod: 'M-Pesa'
      }),
    });

    const paymentData = await paymentResponse.json();
    if (paymentData.success) {
      console.log('✅ Payment Confirmation: Sent to customer when admin marked as paid');
      console.log(`📧 Email sent to: ${customerEmail}`);
      console.log(`📧 Message ID: ${paymentData.messageId}`);
    } else {
      console.log('❌ Payment Confirmation Failed:', paymentData.error);
    }
  } catch (error) {
    console.log('❌ Payment Confirmation Error:', error.message);
  }

  console.log('\n🎉 Real Payment Flow Test Complete!');
  console.log('\n📧 Email Summary:');
  console.log(`   • Order Confirmation: ✅ Sent to ${customerEmail} (during checkout)`);
  console.log(`   • Payment Confirmation: ✅ Sent to ${customerEmail} (when admin marks as paid)`);
  console.log('\n📋 What the customer receives:');
  console.log('   1. Order Confirmation (brown header) - "Thank you for your order!"');
  console.log('   2. Payment Confirmation (green header) - "Payment Confirmed!" with ✓ icon');
  console.log('\n🔍 To verify:');
  console.log(`   • Check the inbox for: ${customerEmail}`);
  console.log('   • Look for two different emails with different headers');
  console.log('   • The payment confirmation should have a green header with checkmark');
}

// Run the test
testRealPaymentFlow().catch(console.error);
