import { 
  sendEmail, 
  EMAILJS_CONFIG,
  buildOrderConfirmationParams,
  buildPaymentConfirmedParams,
  buildPaymentFailedParams,
  buildOrderShippedParams,
  buildWelcomeParams,
  buildContactFormParams,
  buildAdminNotificationParams
} from '../lib/emailjs';

export interface OrderData {
  customer_name: string;
  customer_email: string;
  order_number: string;
  order_date: string;
  total_amount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: string;
  tracking_number?: string;
  estimated_delivery?: string;
}

export interface PaymentData {
  customer_name: string;
  customer_email: string;
  order_number: string;
  payment_amount: number;
  payment_method: string;
  payment_date: string;
  failure_reason?: string;
  retry_url?: string;
}

export interface ShippingData {
  customer_name: string;
  customer_email: string;
  order_number: string;
  tracking_number: string;
  carrier?: string;
  estimated_delivery: string;
  tracking_url?: string;
}

export interface UserData {
  name: string;
  email: string;
  discount_code?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface NotificationData {
  type: string;
  title: string;
  message: string;
  timestamp: string;
  priority?: 'low' | 'medium' | 'high';
}

// Email Template Service
export class EmailTemplateService {
  
  // Order Confirmation Email (Outbound - Site → Customer)
  static async sendOrderConfirmation(orderData: OrderData) {
    const templateParams = {
      ...buildOrderConfirmationParams(orderData),
      template_type: 'order_confirmation'
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.OUTBOUND_TEMPLATE,
      templateParams
    );
  }

  // Payment Confirmed Email (Outbound - Site → Customer)
  static async sendPaymentConfirmed(paymentData: PaymentData) {
    const templateParams = {
      ...buildPaymentConfirmedParams(paymentData),
      template_type: 'payment_confirmed'
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.OUTBOUND_TEMPLATE,
      templateParams
    );
  }

  // Payment Failed Email (Outbound - Site → Customer)
  static async sendPaymentFailed(paymentData: PaymentData) {
    const templateParams = {
      ...buildPaymentFailedParams(paymentData),
      template_type: 'payment_failed'
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.OUTBOUND_TEMPLATE,
      templateParams
    );
  }

  // Order Shipped Email (Outbound - Site → Customer)
  static async sendOrderShipped(shippingData: ShippingData) {
    const templateParams = {
      ...buildOrderShippedParams(shippingData),
      template_type: 'order_shipped'
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.OUTBOUND_TEMPLATE,
      templateParams
    );
  }

  // Order Delivered Email (Outbound - Site → Customer)
  static async sendOrderDelivered(shippingData: ShippingData) {
    const templateParams = {
      ...buildOrderShippedParams(shippingData),
      template_type: 'order_delivered'
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.OUTBOUND_TEMPLATE,
      templateParams
    );
  }

  // Welcome Email (Outbound - Site → Customer)
  static async sendWelcome(userData: UserData) {
    const templateParams = {
      ...buildWelcomeParams(userData),
      template_type: 'welcome'
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.OUTBOUND_TEMPLATE,
      templateParams
    );
  }

  // Password Reset Email (Outbound - Site → Customer)
  static async sendPasswordReset(userData: UserData & { reset_url: string }) {
    const templateParams = {
      to_name: userData.name,
      to_email: userData.email,
      reset_url: userData.reset_url,
      website_url: 'https://wangareluxe.com',
      template_type: 'password_reset'
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.OUTBOUND_TEMPLATE,
      templateParams
    );
  }

  // Newsletter Email (Outbound - Site → Customer)
  static async sendNewsletter(userData: UserData & { newsletter_content: string }) {
    const templateParams = {
      to_name: userData.name,
      to_email: userData.email,
      newsletter_content: userData.newsletter_content,
      website_url: 'https://wangareluxe.com',
      template_type: 'newsletter'
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.OUTBOUND_TEMPLATE,
      templateParams
    );
  }

  // Contact Form Email (Inbound - Customer → Site)
  static async sendContactForm(formData: ContactFormData) {
    const templateParams = {
      ...buildContactFormParams(formData),
      template_type: 'contact_form',
      submission_date: new Date().toLocaleDateString('en-KE'),
      current_date: new Date().toLocaleDateString('en-KE'),
      current_time: new Date().toLocaleTimeString('en-KE')
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.INBOUND_TEMPLATE,
      templateParams
    );
  }

  // Admin Notification Email (Inbound - System → Site)
  static async sendAdminNotification(notificationData: NotificationData) {
    const templateParams = {
      ...buildAdminNotificationParams(notificationData),
      template_type: 'admin_notification',
      current_date: new Date().toLocaleDateString('en-KE'),
      current_time: new Date().toLocaleTimeString('en-KE')
    };
    return await sendEmail(
      EMAILJS_CONFIG.TEMPLATES.INBOUND_TEMPLATE,
      templateParams
    );
  }

  // Bulk Email (for newsletters, promotions)
  static async sendBulkEmail(
    recipients: UserData[],
    templateId: string,
    templateParams: Record<string, any>
  ) {
    const results = [];
    
    for (const recipient of recipients) {
      const params = {
        ...templateParams,
        to_name: recipient.name,
        to_email: recipient.email
      };
      
      const result = await sendEmail(templateId, params);
      results.push({ recipient, result });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  // Test Email (for testing templates)
  static async sendTestEmail(templateId: string, testData: Record<string, any>) {
    return await sendEmail(templateId, testData);
  }
}

// Utility functions for common email operations
export const EmailUtils = {
  // Format currency for emails
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  },

  // Format date for emails
  formatDate: (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Generate order summary for emails
  generateOrderSummary: (items: OrderData['items']) => {
    return items.map(item => 
      `${item.name} x${item.quantity} - ${EmailUtils.formatCurrency(item.price * item.quantity)}`
    ).join('\n');
  },

  // Validate email address
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};
