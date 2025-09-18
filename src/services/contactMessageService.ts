import { supabase, ContactMessage } from '../lib/supabase';

export type { ContactMessage };

export type ContactMessageFormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export const createContactMessage = async (formData: ContactMessageFormData): Promise<ContactMessage> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      status: 'new',
      priority: 'medium',
      source: 'website'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getContactMessagesByStatus = async (status: ContactMessage['status']): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateContactMessageStatus = async (
  messageId: string, 
  status: ContactMessage['status']
): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', messageId);

  if (error) throw error;
};

export const updateContactMessage = async (
  messageId: string, 
  updates: Partial<Pick<ContactMessage, 'priority' | 'assigned_to' | 'internal_notes'>>
): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .update({ 
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', messageId);

  if (error) throw error;
};

export const deleteContactMessage = async (messageId: string): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
};
