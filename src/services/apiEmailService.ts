// Email Service - Using EmailJS since Vercel functions are not working
import emailjs from '@emailjs/browser';

// EmailJS configuration - Replace with your actual values from EmailJS dashboard
const EMAILJS_SERVICE_ID = 'service_1234567'; // Get this from EmailJS dashboard
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // Get this from EmailJS dashboard
const EMAILJS_TEMPLATE_ID = 'template_1234567'; // Get this from EmailJS dashboard

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Test EmailJS connection
export const testSMTPConnection = async () => {
  try {
    // Test EmailJS by sending a simple test email
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'template_test', // Create a test template in EmailJS
      {
        to_email: 'info@wangareluxe.com',
        subject: 'EmailJS Test',
        message: 'This is a test email from EmailJS'
      }
    );
    
    return { 
      success: true, 
      message: 'EmailJS connection successful',
      messageId: result.text 
    };
  } catch (error) {
    console.error('EmailJS connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'EmailJS connection failed' 
    };
  }
};

// Send contact form email
export const sendContactForm = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}) => {
  try {
    // First, store the message in the database
    const { createContactMessage } = await import('./contactMessageService');
    await createContactMessage(formData);

    // Then send the email notification
    const response = await fetch(`${API_BASE_URL}/email?action=contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

// Send test email
export const sendTestEmail = async (to: string, subject: string, message: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/email?action=test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, message }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Test email failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

// Send order confirmation email
export const sendOrderConfirmation = async (orderData: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/email?action=order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Order confirmation email failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

// Send payment confirmation email
export const sendPaymentConfirmation = async (paymentData: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod?: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/email?action=payment-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment confirmation email failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

// Check if API server is running
export const checkAPIServer = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API server check failed:', error);
    return { status: 'ERROR', message: 'API server not reachable' };
  }
};
