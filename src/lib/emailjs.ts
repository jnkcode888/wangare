import emailjs from '@emailjs/browser';

// EmailJS Configuration
export const EMAILJS_CONFIG = {
  // Single service for all emails
  SERVICE_ID: 'master_template', // Your actual service ID (update this if you create a new service)
  PUBLIC_KEY: 'mxdbtkddeHLmcEIx7',
  
  TEMPLATES: {
    // Outbound templates (Site → Customer)
    OUTBOUND_TEMPLATE: 'template_k67t14i',
    ORDER_CONFIRMATION: 'template_k67t14i',
    PAYMENT_CONFIRMED: 'template_k67t14i',
    PAYMENT_FAILED: 'template_k67t14i',
    ORDER_SHIPPED: 'template_k67t14i',
    ORDER_DELIVERED: 'template_k67t14i',
    WELCOME: 'template_k67t14i',
    PASSWORD_RESET: 'template_k67t14i',
    NEWSLETTER: 'template_k67t14i',
    
    // Inbound templates (Customer → Site)
    INBOUND_TEMPLATE: 'template_oy3x779',
    CONTACT_FORM: 'template_oy3x779',
    ADMIN_NOTIFICATION: 'template_oy3x779',
    
    // Legacy single template (for backward compatibility)
    MASTER_TEMPLATE: 'master_template'
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

// Send email function
export const sendEmail = async (
  templateId: string,
  templateParams: Record<string, any>,
  serviceId: string = EMAILJS_CONFIG.SERVICE_ID
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Ensure we have the required parameters for EmailJS
    const emailParams = {
      ...templateParams,
      // Add default recipient if not specified
      to_email: templateParams.to_email || 'info@wangareluxe.com',
      to_name: templateParams.to_name || 'WangarèLuxe Admin'
    };

    // Debug: Log the parameters being sent
    console.log('EmailJS Parameters:', {
      serviceId,
      templateId,
      emailParams,
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY
    });

    const result = await emailjs.send(
      serviceId,
      templateId,
      emailParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    
    console.log('Email sent successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    console.error('Error details:', {
      status: (error as any)?.status,
      text: (error as any)?.text,
      serviceId,
      templateId,
      emailParams: templateParams
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Template parameter builders
export const buildOrderConfirmationParams = (orderData: any) => ({
  to_name: orderData.customer_name,
  to_email: orderData.customer_email,
  order_number: orderData.order_number,
  order_date: orderData.order_date,
  total_amount: orderData.total_amount,
  items: orderData.items,
  shipping_address: orderData.shipping_address,
  tracking_number: orderData.tracking_number || 'N/A',
  estimated_delivery: orderData.estimated_delivery || 'N/A'
});

export const buildPaymentConfirmedParams = (orderData: any) => ({
  to_name: orderData.customer_name,
  to_email: orderData.customer_email,
  order_number: orderData.order_number,
  payment_amount: orderData.payment_amount,
  payment_method: orderData.payment_method,
  payment_date: orderData.payment_date
});

export const buildPaymentFailedParams = (orderData: any) => ({
  to_name: orderData.customer_name,
  to_email: orderData.customer_email,
  order_number: orderData.order_number,
  payment_amount: orderData.payment_amount,
  failure_reason: orderData.failure_reason || 'Payment processing failed',
  retry_url: orderData.retry_url || '#'
});

export const buildOrderShippedParams = (orderData: any) => ({
  to_name: orderData.customer_name,
  to_email: orderData.customer_email,
  order_number: orderData.order_number,
  tracking_number: orderData.tracking_number,
  carrier: orderData.carrier || 'Standard Shipping',
  estimated_delivery: orderData.estimated_delivery,
  tracking_url: orderData.tracking_url || '#'
});

export const buildWelcomeParams = (userData: any) => ({
  to_name: userData.name,
  to_email: userData.email,
  welcome_message: `Welcome to WangarèLuxe, ${userData.name}!`,
  discount_code: userData.discount_code || 'WELCOME10',
  website_url: 'https://wangareluxe.com'
});

export const buildContactFormParams = (formData: any) => ({
  email: 'info@wangareluxe.com', // Admin email (recipient) - matches template variable
  from_name: formData.name,
  from_email: formData.email,
  subject: formData.subject,
  message: formData.message,
  phone: formData.phone || 'N/A'
});

export const buildAdminNotificationParams = (notificationData: any) => ({
  email: 'info@wangareluxe.com', // Admin email (recipient) - matches template variable
  notification_type: notificationData.type,
  notification_title: notificationData.title,
  notification_message: notificationData.message,
  timestamp: notificationData.timestamp,
  priority: notificationData.priority || 'medium'
});
