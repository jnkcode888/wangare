import { supabase, Product } from '../lib/supabase';

export type ProductFormData = {
  name: string;
  description?: string;
  price: number; // Price in KES (will be converted to cents)
  category: string;
  image_url: string;
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: productData.name,
      description: productData.description,
      price: Math.round(productData.price * 100), // Convert to cents
      category: productData.category,
      image_url: productData.image_url,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    price: data.price / 100 // Convert back to KES for display
  };
};

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
  const updateData: any = { ...productData };
  
  // Convert price to cents if provided
  if (updateData.price !== undefined) {
    updateData.price = Math.round(updateData.price * 100);
  }

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    price: data.price / 100 // Convert back to KES for display
  };
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Convert price from cents to KES for display
  const productsWithPrice = data?.map(product => ({
    ...product,
    price: product.price / 100
  })) || [];

  return productsWithPrice;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Convert price from cents to KES for display
  const productsWithPrice = data?.map(product => ({
    ...product,
    price: product.price / 100
  })) || [];

  return productsWithPrice;
};

export const PRODUCT_CATEGORIES = [
  { id: 'bags', name: 'Bags' },
  { id: 'perfumes', name: 'Perfumes' },
  { id: 'jewelry', name: 'Jewelry' },
  { id: 'home', name: 'Home' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'bridal', name: 'Bridal' }
];
