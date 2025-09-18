import React, { useState, useEffect } from 'react';
import { getOrderAnalytics } from '../services/orderService';
import { RefreshCwIcon, TrendingUpIcon, DollarSignIcon, ShoppingBagIcon, AlertCircleIcon, BarChart3Icon } from 'lucide-react';

interface AnalyticsData {
  totalOrders: number;
  paidOrders: number;
  failedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByMonth: Record<string, { count: number; revenue: number }>;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
}

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getOrderAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatPrice = (priceInCents: number): string => {
    return `KES ${(priceInCents / 100).toLocaleString()}`;
  };

  const formatCurrency = (amount: number): string => {
    return `KES ${(amount / 100).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="bg-white w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCwIcon className="animate-spin mx-auto mb-4" size={32} />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon className="mx-auto mb-4 text-red-500" size={32} />
          <p>Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  const monthLabels = Object.keys(analytics.ordersByMonth).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Analytics Dashboard</h2>
        <button
          onClick={fetchAnalytics}
          className="btn btn-outline flex items-center gap-2"
        >
          <RefreshCwIcon size={16} />
          Refresh
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
            </div>
            <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Orders</p>
              <p className="text-2xl font-bold text-green-600">{analytics.paidOrders}</p>
            </div>
            <TrendingUpIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gold">{formatCurrency(analytics.totalRevenue)}</p>
            </div>
            <DollarSignIcon className="h-8 w-8 text-gold" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(analytics.averageOrderValue)}</p>
            </div>
            <BarChart3Icon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-serif text-lg mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{analytics.paidOrders}</p>
            <p className="text-sm text-green-700">Paid Orders</p>
            <p className="text-xs text-green-600">
              {analytics.totalOrders > 0 ? Math.round((analytics.paidOrders / analytics.totalOrders) * 100) : 0}%
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">{analytics.failedOrders}</p>
            <p className="text-sm text-red-700">Failed Orders</p>
            <p className="text-xs text-red-600">
              {analytics.totalOrders > 0 ? Math.round((analytics.failedOrders / analytics.totalOrders) * 100) : 0}%
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{analytics.pendingOrders}</p>
            <p className="text-sm text-yellow-700">Pending Orders</p>
            <p className="text-xs text-yellow-600">
              {analytics.totalOrders > 0 ? Math.round((analytics.pendingOrders / analytics.totalOrders) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Orders Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-serif text-lg mb-4">Orders by Month (Last 6 Months)</h3>
        {monthLabels.length > 0 ? (
          <div className="space-y-4">
            {monthLabels.map((month) => {
              const data = analytics.ordersByMonth[month];
              const maxCount = Math.max(...Object.values(analytics.ordersByMonth).map(d => d.count));
              const percentage = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
              
              return (
                <div key={month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{month}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{data.count} orders</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatCurrency(data.revenue)} revenue
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No orders in the last 6 months</p>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-serif text-lg mb-4">Top Selling Products</h3>
        {analytics.topProducts.length > 0 ? (
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.quantity} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">{formatCurrency(product.revenue)}</p>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No product sales data available</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
