import React, { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon, 
  CreditCardIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  EyeIcon,
  EditIcon,
  RefreshCwIcon,
  DollarSignIcon,
  ReceiptIcon,
  AlertTriangleIcon
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';
  paymentMethod: 'mpesa' | 'card' | 'bank_transfer' | 'cash';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: string;
  billingAddress: string;
  createdAt: Date;
  updatedAt: Date;
  paymentDate?: Date;
  shippingDate?: Date;
  deliveryDate?: Date;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  refundAmount?: number;
  refundReason?: string;
  refundDate?: Date;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId: string;
}

interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  processedAt: Date;
  gateway: string;
  fees: number;
}

interface Refund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedAt: Date;
  processedAt?: Date;
  notes?: string;
}

const EnhancedOrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundData, setRefundData] = useState({
    amount: 0,
    reason: '',
    notes: ''
  });

  // Mock data - in production, this would come from your API
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'WLX-2025-001',
        customerName: 'Sarah Mwangi',
        customerEmail: 'sarah.mwangi@email.com',
        customerPhone: '+254 712 345 678',
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'mpesa',
        totalAmount: 125000,
        items: [
          {
            id: '1',
            productName: 'Nairobi Tote',
            quantity: 1,
            unitPrice: 125000,
            totalPrice: 125000,
            productId: 'prod-1'
          }
        ],
        shippingAddress: '123 Main St, Nairobi, Kenya',
        billingAddress: '123 Main St, Nairobi, Kenya',
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-16'),
        paymentDate: new Date('2025-01-15'),
        shippingDate: new Date('2025-01-16'),
        trackingNumber: 'TRK123456789',
        carrier: 'DHL',
        notes: 'Customer requested express delivery'
      },
      {
        id: '2',
        orderNumber: 'WLX-2025-002',
        customerName: 'Amina Hassan',
        customerEmail: 'amina.hassan@email.com',
        customerPhone: '+254 723 456 789',
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        totalAmount: 85000,
        items: [
          {
            id: '2',
            productName: 'Luxury Wallet',
            quantity: 1,
            unitPrice: 85000,
            totalPrice: 85000,
            productId: 'prod-2'
          }
        ],
        shippingAddress: '456 Oak Ave, Mombasa, Kenya',
        billingAddress: '456 Oak Ave, Mombasa, Kenya',
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-12'),
        paymentDate: new Date('2025-01-10'),
        shippingDate: new Date('2025-01-11'),
        deliveryDate: new Date('2025-01-12'),
        trackingNumber: 'TRK987654321',
        carrier: 'FedEx'
      },
      {
        id: '3',
        orderNumber: 'WLX-2025-003',
        customerName: 'John Doe',
        customerEmail: 'john.doe@email.com',
        customerPhone: '+254 734 567 890',
        status: 'refunded',
        paymentStatus: 'refunded',
        paymentMethod: 'mpesa',
        totalAmount: 95000,
        items: [
          {
            id: '3',
            productName: 'Leather Belt',
            quantity: 1,
            unitPrice: 95000,
            totalPrice: 95000,
            productId: 'prod-3'
          }
        ],
        shippingAddress: '789 Pine St, Kisumu, Kenya',
        billingAddress: '789 Pine St, Kisumu, Kenya',
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-08'),
        paymentDate: new Date('2025-01-05'),
        refundAmount: 95000,
        refundReason: 'Product defect',
        refundDate: new Date('2025-01-08')
      }
    ];

    const mockTransactions: PaymentTransaction[] = [
      {
        id: '1',
        orderId: '1',
        amount: 125000,
        method: 'M-Pesa',
        status: 'completed',
        transactionId: 'MPESA123456',
        processedAt: new Date('2025-01-15'),
        gateway: 'M-Pesa',
        fees: 0
      },
      {
        id: '2',
        orderId: '2',
        amount: 85000,
        method: 'Card',
        status: 'completed',
        transactionId: 'CARD789012',
        processedAt: new Date('2025-01-10'),
        gateway: 'Stripe',
        fees: 2550
      }
    ];

    const mockRefunds: Refund[] = [
      {
        id: '1',
        orderId: '3',
        amount: 95000,
        reason: 'Product defect',
        status: 'processed',
        requestedAt: new Date('2025-01-07'),
        processedAt: new Date('2025-01-08'),
        notes: 'Customer reported quality issue with leather belt'
      }
    ];

    setOrders(mockOrders);
    setPaymentTransactions(mockTransactions);
    setRefunds(mockRefunds);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      paid: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Paid' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Processing' },
      shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Shipped' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: Order['paymentStatus']) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded' },
      partial_refund: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Partial Refund' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleRefund = (order: Order) => {
    setSelectedOrder(order);
    setRefundData({
      amount: order.totalAmount,
      reason: '',
      notes: ''
    });
    setShowRefundModal(true);
  };

  const processRefund = () => {
    if (selectedOrder) {
      // In production, this would call your API
      console.log('Processing refund for order:', selectedOrder.orderNumber, refundData);
      setShowRefundModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Orders & Transactions</h2>
        <div className="flex gap-2">
          <button className="btn btn-outline flex items-center gap-2">
            <DownloadIcon className="h-4 w-4" />
            Export Orders
          </button>
          <button className="btn btn-primary">Add Order</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SearchIcon className="inline w-4 h-4 mr-1" />
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by order number, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FilterIcon className="inline w-4 h-4 mr-1" />
              Order Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FilterIcon className="inline w-4 h-4 mr-1" />
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="partial_refund">Partial Refund</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn btn-outline w-full">
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {getPaymentStatusBadge(order.paymentStatus)}
                      <div className="text-xs text-gray-500 mt-1">{order.paymentMethod}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.totalAmount)}
                    {order.refundAmount && (
                      <div className="text-xs text-red-600">
                        Refunded: {formatCurrency(order.refundAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="Edit">
                        <EditIcon className="h-4 w-4" />
                      </button>
                      {order.paymentStatus === 'paid' && order.status !== 'refunded' && (
                        <button 
                          onClick={() => handleRefund(order)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Process Refund"
                        >
                          <DollarSignIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl">Order Details - {selectedOrder.orderNumber}</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{selectedOrder.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items and Shipping */}
              <div className="space-y-4">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(item.totalPrice)}</div>
                            <div className="text-sm text-gray-600">{formatCurrency(item.unitPrice)} each</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <div className="mt-1">{selectedOrder.shippingAddress}</div>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking:</span>
                        <span className="font-medium">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                    {selectedOrder.carrier && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carrier:</span>
                        <span>{selectedOrder.carrier}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn btn-outline">Print Invoice</button>
              <button className="btn btn-outline">Send Email</button>
              <button className="btn btn-primary">Update Status</button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-lg mb-4">Process Refund</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount
                </label>
                <input
                  type="number"
                  value={refundData.amount}
                  onChange={(e) => setRefundData({...refundData, amount: Number(e.target.value)})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={refundData.reason}
                  onChange={(e) => setRefundData({...refundData, reason: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                >
                  <option value="">Select reason</option>
                  <option value="defect">Product defect</option>
                  <option value="wrong_item">Wrong item sent</option>
                  <option value="damaged">Damaged in transit</option>
                  <option value="customer_request">Customer request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={refundData.notes}
                  onChange={(e) => setRefundData({...refundData, notes: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setShowRefundModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={processRefund}
                className="btn btn-primary"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOrdersManagement;
