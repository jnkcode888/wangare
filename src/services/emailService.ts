import { Order, OrderItem } from '../lib/supabase'
import { EmailTemplateService, EmailUtils } from './emailTemplateService'
import { initEmailJS } from '../lib/emailjs'

// Initialize EmailJS when the service is imported
initEmailJS();

export type EmailTemplate = 'order_confirmation' | 'payment_confirmed' | 'payment_failed'

export interface OrderEmailData {
  order: Order
  orderItems: OrderItem[]
  customerEmail: string
}

const formatPrice = (priceInCents: number): string => {
  return `KES ${(priceInCents / 100).toLocaleString()}`
}

const generateOrderConfirmationEmail = (data: OrderEmailData): string => {
  const { order, orderItems } = data
  
  const itemsList = orderItems.map(item => 
    `• ${item.product_name} (Qty: ${item.quantity}) - ${formatPrice(item.subtotal)}`
  ).join('\n')

  return `
Subject: Order Confirmation - ${order.receipt_number}

Dear ${order.customer_name},

Thank you for your order with WangarèLuxe! We've received your order and it's currently being processed.

Order Details:
Receipt Number: ${order.receipt_number}
Order Date: ${new Date(order.created_at).toLocaleDateString()}

Items Ordered:
${itemsList}

Total Amount: ${formatPrice(order.total_amount)}

Payment Information:
We've received your payment details and will verify your M-Pesa transaction shortly. You will receive another email once your payment has been confirmed.

Delivery Address:
${order.delivery_address || 'To be arranged'}

Thank you for choosing WangarèLuxe. You will get an update after payment verification.

Best regards,
The WangarèLuxe Team
  `.trim()
}

const generatePaymentConfirmedEmail = (data: OrderEmailData): string => {
  const { order } = data

  return `
Subject: Payment Confirmed - ${order.receipt_number}

Dear ${order.customer_name},

Great news! Your payment has been confirmed and your order is now being prepared for shipment.

Order Details:
Receipt Number: ${order.receipt_number}
Total Amount: ${formatPrice(order.total_amount)}

Your order ${order.receipt_number} has been confirmed and will be shipped soon.

We'll send you tracking information once your order has been dispatched.

Thank you for choosing WangarèLuxe!

Best regards,
The WangarèLuxe Team
  `.trim()
}

const generatePaymentFailedEmail = (data: OrderEmailData): string => {
  const { order } = data

  return `
Subject: Payment Verification Issue - ${order.receipt_number}

Dear ${order.customer_name},

We were unable to verify your payment for order ${order.receipt_number}.

This could be due to:
- Incorrect transaction code
- Payment not yet reflected in our system
- Technical issues

Please contact our support team with your M-Pesa transaction details so we can resolve this quickly.

Contact Information:
Email: support@wangariluxe.com
Phone: +254 XXX XXX XXX

We apologize for any inconvenience and look forward to resolving this for you.

Best regards,
The WangarèLuxe Team
  `.trim()
}

export const generateEmailContent = (template: EmailTemplate, data: OrderEmailData): string => {
  switch (template) {
    case 'order_confirmation':
      return generateOrderConfirmationEmail(data)
    case 'payment_confirmed':
      return generatePaymentConfirmedEmail(data)
    case 'payment_failed':
      return generatePaymentFailedEmail(data)
    default:
      throw new Error(`Unknown email template: ${template}`)
  }
}

// Enhanced email sending function with EmailJS integration
export const sendEmail = async (
  to: string,
  template: EmailTemplate,
  data: OrderEmailData
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Convert OrderEmailData to the format expected by EmailTemplateService
    const orderData = {
      customer_name: data.order.customer_name,
      customer_email: data.customerEmail,
      order_number: data.order.receipt_number,
      order_date: EmailUtils.formatDate(data.order.created_at),
      total_amount: data.order.total_amount / 100, // Convert from cents
      items: data.orderItems.map(item => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.subtotal / 100 // Convert from cents
      })),
      shipping_address: data.order.delivery_address || 'To be arranged'
    };

    let result;
    
    switch (template) {
      case 'order_confirmation':
        result = await EmailTemplateService.sendOrderConfirmation(orderData);
        break;
      case 'payment_confirmed':
        result = await EmailTemplateService.sendPaymentConfirmed({
          customer_name: data.order.customer_name,
          customer_email: data.customerEmail,
          order_number: data.order.receipt_number,
          payment_amount: data.order.total_amount / 100,
          payment_method: 'M-Pesa',
          payment_date: EmailUtils.formatDate(new Date())
        });
        break;
      case 'payment_failed':
        result = await EmailTemplateService.sendPaymentFailed({
          customer_name: data.order.customer_name,
          customer_email: data.customerEmail,
          order_number: data.order.receipt_number,
          payment_amount: data.order.total_amount / 100,
          payment_method: 'M-Pesa',
          payment_date: EmailUtils.formatDate(new Date()),
          failure_reason: 'Payment verification failed'
        });
        break;
      default:
        throw new Error(`Unknown email template: ${template}`);
    }

    if (result.success) {
      console.log('📧 Email sent successfully to:', to);
    } else {
      console.error('📧 Email sending failed:', result.error);
    }

    return result;
  } catch (error) {
    console.error('📧 Email service error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Additional email functions for enhanced functionality
export const sendWelcomeEmail = async (userData: { name: string; email: string }) => {
  return await EmailTemplateService.sendWelcome(userData);
};

export const sendContactFormEmail = async (formData: {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  phone?: string;
}) => {
  return await EmailTemplateService.sendContactForm({
    name: formData.from_name,
    email: formData.from_email,
    subject: formData.subject,
    message: formData.message,
    phone: formData.phone
  });
};

export const sendAdminNotification = async (notificationData: {
  type: string;
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}) => {
  return await EmailTemplateService.sendAdminNotification({
    ...notificationData,
    timestamp: new Date().toISOString()
  });
};
