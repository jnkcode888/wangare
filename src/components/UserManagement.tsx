import React, { useState, useEffect } from 'react';
import { ClockIcon, SearchIcon, FilterIcon, TrashIcon, MailIcon, RefreshCwIcon } from 'lucide-react';
import { getAllSubscribers, unsubscribeFromNewsletter, NewsletterSubscriber } from '../services/newsletterService';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

const UserManagement: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'subscribers' | 'activity'>('subscribers');
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null);

  // Fetch newsletter subscribers from Supabase
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const data = await getAllSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();

    // Mock activity logs for demonstration
    const mockActivityLogs: ActivityLog[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Admin',
        action: 'Logged in to admin panel',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        id: '2',
        userId: '1',
        userName: 'Admin',
        action: 'Viewed newsletter subscribers',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    ];

    setActivityLogs(mockActivityLogs);
  }, []);

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? subscriber.is_active : !subscriber.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleUnsubscribe = async (email: string) => {
    if (!window.confirm(`Are you sure you want to unsubscribe ${email} from the newsletter?`)) {
      return;
    }

    setUnsubscribing(email);
    try {
      const result = await unsubscribeFromNewsletter(email);
      if (result.success) {
        await fetchSubscribers(); // Refresh the list
        alert('Successfully unsubscribed from newsletter');
      } else {
        alert(result.error || 'Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      alert('Failed to unsubscribe. Please try again.');
    } finally {
      setUnsubscribing(null);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </span>
      );
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="font-serif text-xl sm:text-2xl">Newsletter Subscribers</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={fetchSubscribers}
            className="btn btn-outline flex items-center justify-center gap-2 text-sm px-3 py-2"
            disabled={loading}
          >
            <RefreshCwIcon size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="btn btn-primary text-sm px-3 py-2">Export Subscribers</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subscribers'
                ? 'border-gold text-gold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <MailIcon size={16} />
              <span className="hidden xs:inline">Subscribers</span>
              <span className="xs:hidden">Subs</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {subscribers.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-gold text-gold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <ClockIcon size={16} />
              <span className="hidden xs:inline">Activity Logs</span>
              <span className="xs:hidden">Activity</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <>
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SearchIcon className="inline w-4 h-4 mr-1" />
                  Search Subscribers
                </label>
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FilterIcon className="inline w-4 h-4 mr-1" />
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subscribers Table - Desktop */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center">
                            <MailIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{subscriber.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscriber.is_active)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.discount_code ? (
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {subscriber.discount_code}
                          </span>
                        ) : (
                          <span className="text-gray-400">No code</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUnsubscribe(subscriber.email)}
                            disabled={unsubscribing === subscriber.email || !subscriber.is_active}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={subscriber.is_active ? "Unsubscribe" : "Already unsubscribed"}
                          >
                            {unsubscribing === subscriber.email ? (
                              <RefreshCwIcon className="h-4 w-4 animate-spin" />
                            ) : (
                              <TrashIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSubscribers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        {loading ? 'Loading subscribers...' : 'No subscribers found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscribers Cards - Mobile */}
          <div className="lg:hidden space-y-4">
            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center">
                      <MailIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{subscriber.email}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(subscriber.is_active)}
                    <button 
                      onClick={() => handleUnsubscribe(subscriber.email)}
                      disabled={unsubscribing === subscriber.email || !subscriber.is_active}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                      title={subscriber.is_active ? "Unsubscribe" : "Already unsubscribed"}
                    >
                      {unsubscribing === subscriber.email ? (
                        <RefreshCwIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {subscriber.discount_code && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Discount Code:</span>
                    <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {subscriber.discount_code}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {filteredSubscribers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {loading ? 'Loading subscribers...' : 'No subscribers found'}
              </div>
            )}
          </div>
        </>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <p className="text-sm font-medium text-gray-900">
                        {log.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(log.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.action}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-500">
                      <span>IP: {log.ipAddress}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Browser: {log.userAgent.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
