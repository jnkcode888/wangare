import { Product } from '../lib/supabase';

export interface ProductNotificationData {
  product: Product;
  discountCode?: string;
  discountPercentage?: number;
}

export const sendNewProductNotification = async (productData: ProductNotificationData) => {
  try {
    const response = await fetch('https://www.wangareluxe.com/api/email?action=new-product-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Product notification error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

export const sendBulkProductNotification = async (productData: ProductNotificationData, subscriberEmails: string[]) => {
  try {
    const response = await fetch('https://www.wangareluxe.com/api/email?action=bulk-product-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...productData,
        subscriberEmails
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Bulk product notification error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};
