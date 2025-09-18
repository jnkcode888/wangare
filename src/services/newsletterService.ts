import { supabase } from '../lib/supabase';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  discount_code?: string;
}

export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; error?: string; discountCode?: string }> => {
  try {
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (existingSubscriber) {
      return { success: false, error: 'Email already subscribed' };
    }

    // Generate discount code
    const discountCode = `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        is_active: true,
        discount_code: discountCode,
        subscribed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Newsletter subscription error:', error);
      return { success: false, error: 'Failed to subscribe. Please try again.' };
    }

    return { success: true, discountCode };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const getAllSubscribers = async (): Promise<NewsletterSubscriber[]> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
};

export const unsubscribeFromNewsletter = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('email', email);

    if (error) {
      console.error('Unsubscribe error:', error);
      return { success: false, error: 'Failed to unsubscribe. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};
