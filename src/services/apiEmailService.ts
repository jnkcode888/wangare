// API Email Service - Frontend service that calls Vercel API routes
import { createContactMessage } from './contactMessageService';

// Use Vercel API URL - will be replaced with custom domain once functions are working
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wangare.vercel.app/api'
  : 'http://localhost:3000/api';

// Test SMTP connection
export const testSMTPConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/email?action=test-connection`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('SMTP connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
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
