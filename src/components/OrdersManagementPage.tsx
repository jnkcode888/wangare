import React, { useState, useEffect } from 'react';
import { supabase, Order, OrderItem } from '../lib/supabase';
import { getAllOrders, getOrdersByStatus, updateOrderStatus } from '../services/orderService';
import { sendPaymentConfirmation } from '../services/apiEmailService';
import { CheckIcon, XIcon, EyeIcon, RefreshCwIcon, FilterIcon, SearchIcon, CalendarIcon } from 'lucide-react';

type OrderStatus = 'all' | 'paid' | 'failed' | 'pending_verification';

const OrdersManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [orderId: string]: OrderItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let ordersData: Order[];
      
      if (statusFilter === 'all') {
        ordersData = await getAllOrders();
      } else {
        ordersData = await getOrdersByStatus(statusFilter);
      }
      
      setOrders(ordersData);

      // Fetch order items for each order
      const itemsPromises = ordersData.map(async (order) => {
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
      await fetchOrders();
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

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      pending_verification: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Shipped' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || 
      new Date(order.created_at).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesSearch && matchesDate;
  });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Orders Management</h2>
        <button
          onClick={fetchOrders}
          className="btn btn-outline flex items-center gap-2"
        >
          <RefreshCwIcon size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FilterIcon className="inline w-4 h-4 mr-1" />
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="paid">Paid Orders</option>
              <option value="failed">Failed Orders</option>
              <option value="pending_verification">Pending Orders</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SearchIcon className="inline w-4 h-4 mr-1" />
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by receipt, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="inline w-4 h-4 mr-1" />
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <RefreshCwIcon size={48} />
          </div>
          <h3 className="font-serif text-2xl mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {searchTerm || dateFilter 
              ? 'No orders match your current filters.' 
              : 'No orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-serif text-xl">{order.receipt_number}</h3>
                    {getStatusBadge(order.status)}
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
                  
                  {order.status === 'pending_verification' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'paid', order.customer_email)}
                        disabled={processingOrder === order.id}
                        className="btn btn-primary flex items-center gap-1 flex-1 justify-center"
                      >
                        <CheckIcon size={16} />
                        Mark Paid
                      </button>
                      
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'failed', order.customer_email)}
                        disabled={processingOrder === order.id}
                        className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 flex-1 justify-center"
                      >
                        <XIcon size={16} />
                        Mark Failed
                      </button>
                    </div>
                  )}

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
    </div>
  );
};

export default OrdersManagementPage;
