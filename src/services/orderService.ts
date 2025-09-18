import { supabase, Order, OrderItem } from '../lib/supabase'
import { CartItem } from '../context/CartContext'

export type OrderFormData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress?: string
  transactionCode?: string
  transactionScreenshot?: File
}

// Generate unique receipt number in format WLX-YYYY-#####
const generateReceiptNumber = (): string => {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `WLX-${year}-${randomNum}`
}

// Upload screenshot to Supabase storage
const uploadScreenshot = async (file: File, orderId: string): Promise<string> => {
  console.log('Uploading screenshot:', { fileName: file.name, fileSize: file.size, fileType: file.type, orderId });
  
  const fileExt = file.name.split('.').pop()
  const fileName = `payment-screenshot-${orderId}-${Date.now()}.${fileExt}`
  const filePath = `screenshots/${fileName}`

  console.log('Upload path:', filePath);

  // Use product-images bucket directly since it works for product uploads
  console.log('Using product-images bucket for screenshot upload');
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (error) {
    console.error('Screenshot upload error:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: (error as any)?.statusCode,
      error: (error as any)?.error
    });
    throw error;
  }

  console.log('Screenshot upload successful:', data);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  console.log('Generated screenshot URL:', publicUrl);

  return publicUrl
}

export const createOrder = async (
  cartItems: CartItem[],
  formData: OrderFormData,
  totalAmount: number
): Promise<{ order: Order; receiptNumber: string }> => {
  const receiptNumber = generateReceiptNumber()
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      receipt_number: receiptNumber,
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      delivery_address: formData.deliveryAddress,
      total_amount: Math.round(totalAmount * 100), // Convert to cents
      status: 'pending_verification',
      payment_method: 'mpesa',
      transaction_code: formData.transactionCode,
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Upload screenshot if provided
  let screenshotUrl = ''
  if (formData.transactionScreenshot) {
    console.log('Screenshot provided, attempting upload...');
    try {
      screenshotUrl = await uploadScreenshot(formData.transactionScreenshot, order.id)
      
      // Update order with screenshot URL
      const { error: updateError } = await supabase
        .from('orders')
        .update({ transaction_screenshot: screenshotUrl })
        .eq('id', order.id)
        
      if (updateError) {
        console.error('Failed to update order with screenshot URL:', updateError);
      } else {
        console.log('Order updated with screenshot URL successfully');
      }
    } catch (error) {
      console.error('Failed to upload screenshot:', error)
      // Continue with order creation even if screenshot upload fails
    }
  } else {
    console.log('No screenshot provided');
  }

  // Create order items
  const orderItems: Omit<OrderItem, 'id'>[] = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    product_price: Math.round(item.price * 100), // Convert to cents
    quantity: item.quantity,
    subtotal: Math.round(item.price * item.quantity * 100) // Convert to cents
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return {
    order: {
      ...order,
      transaction_screenshot: screenshotUrl
    },
    receiptNumber
  }
}

export const getOrderByReceiptNumber = async (receiptNumber: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('receipt_number', receiptNumber)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }

  return data
}

export const updateOrderStatus = async (
  orderId: string, 
  status: Order['status']
): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)

  if (error) throw error
}

export const getPendingOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'pending_verification')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

export const getOrderAnalytics = async () => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')

  if (error) throw error

  const allOrders = orders || []
  
  // Calculate analytics
  const totalOrders = allOrders.length
  const paidOrders = allOrders.filter(order => order.status === 'paid')
  const failedOrders = allOrders.filter(order => order.status === 'failed')
  const pendingOrders = allOrders.filter(order => order.status === 'pending_verification')
  
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total_amount, 0)
  const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0
  
  // Orders by month (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const recentOrders = allOrders.filter(order => 
    new Date(order.created_at) >= sixMonthsAgo
  )
  
  const ordersByMonth = recentOrders.reduce((acc, order) => {
    const month = new Date(order.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
    if (!acc[month]) {
      acc[month] = { count: 0, revenue: 0 }
    }
    acc[month].count++
    if (order.status === 'paid') {
      acc[month].revenue += order.total_amount
    }
    return acc
  }, {} as Record<string, { count: number; revenue: number }>)
  
  // Top products (from order items)
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('product_name, quantity, product_price')
  
  if (itemsError) throw itemsError
  
  const productSales = (orderItems || []).reduce((acc, item) => {
    if (!acc[item.product_name]) {
      acc[item.product_name] = { quantity: 0, revenue: 0 }
    }
    acc[item.product_name].quantity += item.quantity
    acc[item.product_name].revenue += item.product_price * item.quantity
    return acc
  }, {} as Record<string, { quantity: number; revenue: number }>)
  
  const topProducts = Object.entries(productSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  return {
    totalOrders,
    paidOrders: paidOrders.length,
    failedOrders: failedOrders.length,
    pendingOrders: pendingOrders.length,
    totalRevenue,
    averageOrderValue,
    ordersByMonth,
    topProducts
  }
}