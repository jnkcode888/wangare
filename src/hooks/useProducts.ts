import { useState, useEffect } from 'react'
import { supabase, Product } from '../lib/supabase'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Convert price from cents to KES for display
      const productsWithPrice = data?.map(product => ({
        ...product,
        price: product.price / 100
      })) || []

      setProducts(productsWithPrice)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const getProductById = (id: string) => {
    return products.find(product => product.id === id)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category)
  }

  return {
    products,
    loading,
    error,
    getProductById,
    getProductsByCategory,
    refetch: fetchProducts
  }
}
