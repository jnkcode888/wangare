import React, { useState, useEffect } from 'react';
import { MessageSquareIcon, MailIcon, PhoneIcon, ClockIcon, SearchIcon, FilterIcon, ArchiveIcon, TrashIcon, StarIcon, CheckIcon, RefreshCwIcon, XIcon } from 'lucide-react';
import { getAllContactMessages, updateContactMessageStatus, ContactMessage } from '../services/contactMessageService';

const MessagesManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);

  // Fetch contact messages from Supabase
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getAllContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ContactMessage['status']) => {
    const statusConfig: Record<ContactMessage['status'], { bg: string; text: string; label: string }> = {
      new: { bg: 'bg-red-100', text: 'text-red-800', label: 'New' },
      read: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Read' },
      replied: { bg: 'bg-green-100', text: 'text-green-800', label: 'Replied' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: ContactMessage['priority']) => {
    const priorityConfig: Record<ContactMessage['priority'], { bg: string; text: string; label: string }> = {
      low: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
      high: { bg: 'bg-red-100', text: 'text-red-800', label: 'High' }
    };
    
    const config = priorityConfig[priority];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleStatusChange = async (messageId: string, newStatus: ContactMessage['status']) => {
    try {
      await updateContactMessageStatus(messageId, newStatus);
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, status: newStatus }
          : message
      )
    );
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status');
    }
  };


  const handleMessageSelect = (message: ContactMessage) => {
    setSelectedMessage(message);
    // On mobile, show overlay
    if (window.innerWidth < 1024) {
      setShowMobileOverlay(true);
    }
  };

  const closeMobileOverlay = () => {
    setShowMobileOverlay(false);
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl">Contact Messages</h2>
        <div className="flex gap-2">
          <button 
            onClick={fetchMessages}
            className="btn btn-outline flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCwIcon size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="btn btn-primary">Export Messages</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SearchIcon className="inline w-4 h-4 mr-1" />
              Search Messages
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
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
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMessage?.id === message.id 
                  ? 'border-gold bg-gold-light' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${message.status === 'new' ? 'bg-blue-50' : ''}`}
              onClick={() => handleMessageSelect(message)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium text-gray-900">{message.name}</h3>
                  {message.priority === 'high' && (
                    <StarIcon className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(message.priority)}
                  {getStatusBadge(message.status)}
                </div>
              </div>
              
              <p className="text-sm font-medium text-gray-700 mb-1">{message.subject}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{message.message}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{message.email}</span>
                <span>{formatTimeAgo(message.created_at)}</span>
              </div>
            </div>
          ))}
          {filteredMessages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{loading ? 'Loading messages...' : 'No messages found'}</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg">Message Details</h3>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedMessage.status)}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <p className="text-sm text-gray-900">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-sm text-gray-600">{selectedMessage.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Received</label>
                  <p className="text-sm text-gray-600">{formatTimeAgo(selectedMessage.created_at)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=Dear ${selectedMessage.name},%0D%0A%0D%0AThank you for contacting Wangarè Luxe.%0D%0A%0D%0A%0D%0A---%0D%0AOriginal message:%0D%0A${selectedMessage.message}`}
                    className="btn btn-primary flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MailIcon className="h-4 w-4" />
                    Reply via Email
                  </a>
                  
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <CheckIcon className="h-4 w-4" />
                    Mark as Read
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <ArchiveIcon className="h-4 w-4" />
                    Archive
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {showMobileOverlay && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute inset-0 bg-white m-4 rounded-lg overflow-hidden flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-serif text-lg">Message Details</h3>
              <button
                onClick={closeMobileOverlay}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <p className="text-sm text-gray-900">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-sm text-gray-600">{selectedMessage.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Received</label>
                  <p className="text-sm text-gray-600">{formatTimeAgo(selectedMessage.created_at)}</p>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="border-t pt-4">
                <div className="flex flex-col gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=Dear ${selectedMessage.name},%0D%0A%0D%0AThank you for contacting Wangarè Luxe.%0D%0A%0D%0A%0D%0A---%0D%0AOriginal message:%0D%0A${selectedMessage.message}`}
                    className="btn btn-primary flex items-center justify-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MailIcon className="h-4 w-4" />
                    Reply via Email
                  </a>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      className="btn btn-outline flex-1 flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Mark as Read
                    </button>
                    
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                      className="btn btn-outline flex-1 flex items-center justify-center gap-2"
                    >
                      <ArchiveIcon className="h-4 w-4" />
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesManagement;
