import React, { useState, useEffect } from 'react';
import { supabase, Order, OrderItem, Product } from '../lib/supabase';
import { updateOrderStatus, getPendingOrders } from '../services/orderService';
import { sendPaymentConfirmation } from '../services/apiEmailService';
import { sendBulkProductNotification } from '../services/productNotificationService';
import { getAllSubscribers } from '../services/newsletterService';
import { createProduct, updateProduct, deleteProduct, getAllProducts, ProductFormData, PRODUCT_CATEGORIES } from '../services/productService';
import { useAdminAuth } from '../context/AdminAuthContext';
import AnalyticsPage from '../components/AnalyticsPage';
import UserManagement from '../components/UserManagement';
import MessagesManagement from '../components/MessagesManagement';
import NotificationsPanel from '../components/NotificationsPanel';
import EnhancedOrdersManagement from '../components/EnhancedOrdersManagement';
import SiteSettings from '../components/SiteSettings';
import EcommerceSettings from '../components/EcommerceSettings';
import { CheckIcon, XIcon, EyeIcon, RefreshCwIcon, ClockIcon, PackageIcon, PlusIcon, EditIcon, TrashIcon, LogOutIcon, ShoppingBagIcon, UploadIcon, ImageIcon, BarChart3Icon, ListIcon, HomeIcon, TrendingUpIcon, DollarSignIcon, UsersIcon, MessageSquareIcon, SettingsIcon, MenuIcon } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'analytics' | 'orders-management' | 'products' | 'users' | 'messages' | 'settings' | 'ecommerce'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [orderId: string]: OrderItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'bags',
    image_url: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [sendingNotifications, setSendingNotifications] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'orders') {
    fetchPendingOrders();
    }
    if (activeTab === 'dashboard' || activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const pendingOrders = await getPendingOrders();
      setOrders(pendingOrders);

      // Fetch order items for each order
      const itemsPromises = pendingOrders.map(async (order) => {
        const { data, error } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (error) throw error;
        return { orderId: order.id, items: data || [] };
      });

      const itemsResults = await Promise.all(itemsPromises);
      const itemsMap: { [orderId: string]: OrderItem[] } = {};
      itemsResults.forEach(({ orderId, items }) => {
        itemsMap[orderId] = items;
      });
      setOrderItems(itemsMap);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], customerEmail: string) => {
    setProcessingOrder(orderId);
    try {
      await updateOrderStatus(orderId, status);
      
      // Send email notification
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const items = orderItems[orderId] || [];
        
        if (status === 'paid') {
          // Send payment confirmation email
          await sendPaymentConfirmation({
            customerName: order.customer_name,
            customerEmail: customerEmail,
            orderNumber: order.receipt_number,
            items: items.map(item => ({
              name: item.product_name,
              quantity: item.quantity,
              price: item.product_price / 100
            })),
            total: order.total_amount / 100,
            paymentMethod: 'M-Pesa'
          });
        }
        // Note: Payment failed emails would need a separate template/function
      }

      // Refresh orders list
      await fetchPendingOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setProcessingOrder(null);
    }
  };

  const formatPrice = (priceInCents: number): string => {
    return `KES ${(priceInCents / 100).toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Product Management Functions
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there's a selected file but no image_url, upload it first
    if (selectedFile && !productFormData.image_url) {
      try {
        setUploadingImage(true);
        const imageUrl = await uploadImageToSupabase(selectedFile);
        setProductFormData({ ...productFormData, image_url: imageUrl });
        setPreviewUrl('');
        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }
    
    try {
      console.log('Saving product with data:', productFormData);
      
      let savedProduct;
      if (editingProduct) {
        savedProduct = await updateProduct(editingProduct.id, productFormData);
      } else {
        savedProduct = await createProduct(productFormData);
        console.log('Product created successfully:', savedProduct);
        
        // Send newsletter notification for new products
        if (notifySubscribers && savedProduct) {
          setSendingNotifications(true);
          try {
            // Get all active subscribers
            const subscribers = await getAllSubscribers();
            const subscriberEmails = subscribers.map(sub => sub.email);
            
            if (subscriberEmails.length > 0) {
              console.log(`Sending product notification to ${subscriberEmails.length} subscribers`);
              
              const notificationResult = await sendBulkProductNotification({
                product: savedProduct,
                discountPercentage: 15
              }, subscriberEmails);
              
              if (notificationResult.success) {
                console.log('Newsletter notifications sent:', notificationResult.message);
                alert(`Product created and ${notificationResult.successCount} subscribers notified!`);
              } else {
                console.error('Newsletter notification failed:', notificationResult.error);
                alert('Product created but newsletter notification failed. Check console for details.');
              }
            } else {
              console.log('No subscribers to notify');
              alert('Product created successfully! (No subscribers to notify)');
            }
          } catch (notificationError) {
            console.error('Newsletter notification error:', notificationError);
            alert('Product created but newsletter notification failed. Check console for details.');
          } finally {
            setSendingNotifications(false);
          }
        } else {
          alert('Product created successfully!');
        }
      }
      
      await fetchProducts();
      resetProductForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setSendingNotifications(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      image_url: product.image_url
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const resetProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: 0,
      category: 'bags',
      image_url: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  // Image Upload Functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log('Uploading image to Supabase:', { fileName, filePath });

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('Generated public URL:', publicUrl);

    return publicUrl;
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadImageToSupabase(selectedFile);
      setProductFormData({ ...productFormData, image_url: imageUrl });
      setPreviewUrl('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. You can still use an image URL.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  if (loading) {
    return (
      <div className="bg-white w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCwIcon className="animate-spin mx-auto mb-4" size={32} />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="bg-gray-50 py-8">
        <div className="container-luxe relative">
          {/* Header - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage orders and products</p>
            </div>
            
            {/* Action Buttons - Mobile Optimized */}
            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationsPanel />
              <button
                onClick={activeTab === 'orders' ? fetchPendingOrders : fetchProducts}
                className="btn btn-outline flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2"
                title="Refresh data"
                aria-label="Refresh data"
              >
                <RefreshCwIcon size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2"
                title="Logout from admin"
                aria-label="Logout from admin"
              >
                <LogOutIcon size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Logout</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Toggle Button - Top Right */}
          <div className="lg:hidden absolute top-4 right-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-outline flex items-center gap-2 text-sm px-3 py-2 bg-white shadow-lg"
              title="Toggle navigation menu"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <XIcon size={18} className="w-5 h-5" />
              ) : (
                <MenuIcon size={18} className="w-5 h-5" />
              )}
              <span className="hidden xs:inline">Menu</span>
            </button>
          </div>
          
          {/* Desktop Navigation Tabs - Hidden on Mobile */}
          <div className="mt-4 sm:mt-8 hidden lg:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => handleTabChange('dashboard')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'dashboard'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HomeIcon size={16} />
                    Dashboard
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('orders')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ClockIcon size={16} />
                    Pending Orders ({orders.filter(order => order.status === 'pending_verification').length})
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('analytics')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3Icon size={16} />
                    Analytics
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('orders-management')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders-management'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ListIcon size={16} />
                    All Orders
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('products')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'products'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon size={16} />
                    Products ({products.length})
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UsersIcon size={16} />
                    Users
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('messages')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'messages'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon size={16} />
                    Messages
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('settings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SettingsIcon size={16} />
                    Settings
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('ecommerce')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'ecommerce'
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon size={16} />
                    E-commerce
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-serif text-lg">Navigation</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <XIcon size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <HomeIcon size={20} />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'orders'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ClockIcon size={20} />
            <span>Pending Orders</span>
            <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {orders.filter(order => order.status === 'pending_verification').length}
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('analytics')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'analytics'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3Icon size={20} />
            <span>Analytics</span>
          </button>
          
          <button
            onClick={() => handleTabChange('orders-management')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'orders-management'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ListIcon size={20} />
            <span>All Orders</span>
          </button>
          
          <button
            onClick={() => handleTabChange('products')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'products'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ShoppingBagIcon size={20} />
            <span>Products</span>
            <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {products.length}
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('users')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'users'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UsersIcon size={20} />
            <span>Users</span>
          </button>
          
          <button
            onClick={() => handleTabChange('messages')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'messages'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquareIcon size={20} />
            <span>Messages</span>
          </button>
          
          
          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'settings'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </button>
          
          <button
            onClick={() => handleTabChange('ecommerce')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === 'ecommerce'
                ? 'bg-gold text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ShoppingBagIcon size={20} />
            <span>E-commerce</span>
          </button>
        </nav>
      </div>

      <div className="container-luxe py-4 sm:py-8 px-3 sm:px-4 lg:px-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-gold to-gold-light rounded-lg p-4 sm:p-6 text-white">
              <h2 className="font-serif text-xl sm:text-2xl mb-2">Welcome to WangarèLuxe Admin</h2>
              <p className="text-gold-100 text-sm sm:text-base">Manage your luxury brand with ease and efficiency</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Sales */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      KES {orders.reduce((sum, order) => sum + order.total_amount, 0) / 100}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <DollarSignIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{orders.length}</p>
                    <p className="text-xs text-blue-600 mt-1">+8 new this week</p>
                  </div>
                  <PackageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                </div>
              </div>

              {/* Pending Orders */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                      {orders.filter(order => order.status === 'pending_verification').length}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Awaiting verification</p>
                  </div>
                  <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
                </div>
              </div>

              {/* Total Products */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{products.length}</p>
                    <p className="text-xs text-purple-600 mt-1">Active listings</p>
                  </div>
                  <ShoppingBagIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Orders */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-gold hover:text-gold-dark"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{order.receipt_number}</p>
                        <p className="text-xs text-gray-500">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">KES {(order.total_amount / 100).toLocaleString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'pending_verification' ? 'Pending' : order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No orders yet</p>
                  )}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg">Top Products</h3>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-sm text-gold hover:text-gold-dark"
                  >
                    Manage
                  </button>
                </div>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">KES {product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No products yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h3 className="font-serif text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                  <div className="text-left">
                    <p className="font-medium">Process Orders</p>
                    <p className="text-sm text-gray-500">Review pending orders</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('products')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PlusIcon className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">Add Product</p>
                    <p className="text-sm text-gray-500">Create new listing</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TrendingUpIcon className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">View Analytics</p>
                    <p className="text-sm text-gray-500">Check performance</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <PackageIcon className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="font-serif text-2xl mb-2">No Pending Orders</h3>
                <p className="text-gray-600">All orders have been processed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-serif text-xl">{order.receipt_number}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                        <ClockIcon size={12} />
                        Pending Verification
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Customer</p>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-gray-600">{order.customer_email}</p>
                        <p className="text-gray-600">{order.customer_phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Order Details</p>
                        <p className="font-medium">{formatPrice(order.total_amount)}</p>
                        <p className="text-gray-600">{formatDate(order.created_at)}</p>
                        <p className="text-gray-600">
                          {orderItems[order.id]?.length || 0} item(s)
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Payment Info</p>
                        {order.transaction_code && (
                          <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {order.transaction_code}
                          </p>
                        )}
                        {order.transaction_screenshot && (
                          <a
                            href={order.transaction_screenshot}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Screenshot
                          </a>
                        )}
                        {!order.transaction_code && !order.transaction_screenshot && (
                          <p className="text-gray-400 text-sm">No payment proof provided</p>
                        )}
                      </div>
                    </div>

                    {order.delivery_address && (
                      <div className="mt-4">
                        <p className="text-gray-500 text-sm">Delivery Address</p>
                        <p className="text-sm">{order.delivery_address}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-[200px]">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="btn btn-outline flex items-center gap-2 justify-center"
                    >
                      <EyeIcon size={16} />
                      {selectedOrder?.id === order.id ? 'Hide Details' : 'View Items'}
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'paid', order.customer_email)}
                        disabled={processingOrder === order.id}
                        className="btn btn-primary flex items-center gap-1 flex-1 justify-center"
                      >
                        <CheckIcon size={16} />
                        Paid
                      </button>
                      
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'failed', order.customer_email)}
                        disabled={processingOrder === order.id}
                        className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 flex-1 justify-center"
                      >
                        <XIcon size={16} />
                        Failed
                      </button>
                    </div>

                    {processingOrder === order.id && (
                      <p className="text-sm text-gray-500 text-center">Processing...</p>
                    )}
                  </div>
                </div>

                {/* Order Items Details */}
                {selectedOrder?.id === order.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {orderItems[order.id]?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × {formatPrice(item.product_price)}
                            </p>
                          </div>
                          <p className="font-medium">{formatPrice(item.subtotal)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && <AnalyticsPage />}

      {/* Orders Management Tab */}
      {activeTab === 'orders-management' && <EnhancedOrdersManagement />}

      {/* Users Tab */}
      {activeTab === 'users' && <UserManagement />}

      {/* Messages Tab */}
      {activeTab === 'messages' && <MessagesManagement />}


      {/* Settings Tab */}
      {activeTab === 'settings' && <SiteSettings />}

      {/* E-commerce Tab */}
      {activeTab === 'ecommerce' && <EcommerceSettings />}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl">Product Management</h2>
            <button
              onClick={() => setShowProductForm(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <PlusIcon size={16} />
              Add Product
            </button>
          </div>

          {/* Product Form Modal */}
          {showProductForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-xl">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button
                      onClick={resetProductForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XIcon size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Name</label>
                      <input
                        type="text"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={productFormData.description}
                        onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Price (KES)</label>
                      <input
                        type="number"
                        value={productFormData.price}
                        onChange={(e) => setProductFormData({...productFormData, price: Number(e.target.value)})}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={productFormData.category}
                        onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                        required
                      >
                        {PRODUCT_CATEGORIES.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Newsletter Notification Checkbox - Only show for new products */}
                    {!editingProduct && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <input
                          type="checkbox"
                          id="notify-subscribers"
                          checked={notifySubscribers}
                          onChange={(e) => setNotifySubscribers(e.target.checked)}
                          className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                        />
                        <label htmlFor="notify-subscribers" className="text-sm text-blue-800">
                          <span className="font-medium">Notify newsletter subscribers</span>
                          <br />
                          <span className="text-blue-600">Send exclusive discount offer to all subscribers (15% off)</span>
                        </label>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">Product Image</label>
                      
                      {/* Image Upload Section */}
                      <div className="space-y-3">
                        {/* Current Image Preview */}
                        {(productFormData.image_url || previewUrl) && (
                          <div className="relative">
                            <img
                              src={previewUrl || productFormData.image_url}
                              alt="Product preview"
                              className="w-32 h-32 object-cover rounded border"
                              onError={(e) => {
                                console.error('Image failed to load:', e.currentTarget.src);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            {previewUrl && (
                              <button
                                type="button"
                                onClick={removeSelectedImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <XIcon size={12} />
                              </button>
                            )}
                            {productFormData.image_url && !previewUrl && (
                              <div className="absolute bottom-0 left-0 right-0 bg-green-100 text-green-800 text-xs p-1 text-center">
                                ✓ Uploaded
                              </div>
                            )}
                          </div>
                        )}

                        {/* File Upload */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                            <label
                              htmlFor="image-upload"
                              className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                              <ImageIcon size={16} />
                              Choose Image
                            </label>
                            
                            {selectedFile && (
                              <button
                                type="button"
                                onClick={handleImageUpload}
                                disabled={uploadingImage}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                              >
                                <UploadIcon size={16} />
                                {uploadingImage ? 'Uploading...' : 'Upload'}
                              </button>
                            )}
                          </div>
                          
                          {selectedFile && (
                            <p className="text-sm text-gray-600">
                              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>

                        {/* OR Divider */}
                        <div className="flex items-center gap-2">
                          <hr className="flex-1" />
                          <span className="text-sm text-gray-500">OR</span>
                          <hr className="flex-1" />
                        </div>

                        {/* URL Input */}
                        <div>
                          <label className="block text-sm font-medium mb-1">Image URL</label>
                          <input
                            type="url"
                            value={productFormData.image_url}
                            onChange={(e) => setProductFormData({...productFormData, image_url: e.target.value})}
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                            placeholder="https://example.com/image.jpg"
                            required={!selectedFile}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={sendingNotifications}
                        className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingNotifications ? (
                          <span className="flex items-center gap-2">
                            <RefreshCwIcon className="animate-spin" size={16} />
                            {editingProduct ? 'Updating...' : 'Creating & Notifying...'}
                          </span>
                        ) : (
                          editingProduct ? 'Update Product' : 'Add Product'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetProductForm}
                        disabled={sendingNotifications}
                        className="btn btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Products List */}
          {productsLoading ? (
            <div className="text-center py-8">
              <RefreshCwIcon className="animate-spin mx-auto mb-4" size={32} />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBagIcon className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="font-serif text-2xl mb-2">No Products</h3>
              <p className="text-gray-600">Add your first product to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{product.name}</h3>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded capitalize">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-gold font-medium mb-4">
                      KES {product.price.toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="btn btn-outline flex-1 flex items-center justify-center gap-1"
                      >
                        <EditIcon size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="btn bg-red-600 text-white hover:bg-red-700 flex-1 flex items-center justify-center gap-1"
                      >
                        <TrashIcon size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default AdminPage;
