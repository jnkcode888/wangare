import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserIcon, PackageIcon, HeartIcon, MapPinIcon, CreditCardIcon, BellIcon, LogOutIcon } from 'lucide-react';
const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'orders');
  // Mock data for the account
  const user = {
    name: 'Sarah Kamau',
    email: 'sarah.kamau@example.com',
    phone: '+254 712 345 678'
  };
  const orders = [{
    id: 'WL-2023-1234',
    date: '2023-06-15',
    status: 'Delivered',
    total: 12500,
    items: [{
      name: 'The Nairobi Tote',
      quantity: 1
    }]
  }, {
    id: 'WL-2023-0987',
    date: '2023-05-22',
    status: 'Processing',
    total: 8900,
    items: [{
      name: 'Amber Sunset Perfume',
      quantity: 1
    }, {
      name: 'Gold Pearl Earrings',
      quantity: 1
    }]
  }];
  const wishlist = [{
    id: '6',
    name: 'Designer Sunglasses',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3'
  }, {
    id: '7',
    name: 'Bridal Silk Robe',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3'
  }, {
    id: '15',
    name: 'Laptop Sleeve',
    price: 6200,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3'
  }];
  const addresses = [{
    id: '1',
    name: 'Home',
    address: '123 Riverside Drive',
    city: 'Nairobi',
    postalCode: '00100',
    isDefault: true
  }, {
    id: '2',
    name: 'Office',
    address: '456 Kenyatta Avenue',
    city: 'Nairobi',
    postalCode: '00200',
    isDefault: false
  }];
  const paymentMethods = [{
    id: '1',
    type: 'card',
    name: 'Visa ending in 4242',
    expiryDate: '06/25',
    isDefault: true
  }, {
    id: '2',
    type: 'mpesa',
    name: 'M-Pesa',
    phone: '+254 712 345 678',
    isDefault: false
  }];
  return <div className="bg-white w-full">
      <div className="bg-gray-50 py-12">
        <div className="container-luxe">
          <h1 className="font-serif text-3xl md:text-4xl text-center">
            My Account
          </h1>
        </div>
      </div>
      <div className="container-luxe py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-50 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                  <UserIcon size={32} className="text-gray-500" />
                </div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <nav className="space-y-1">
                <button onClick={() => setActiveTab('orders')} className={`flex items-center w-full px-4 py-3 text-left ${activeTab === 'orders' ? 'bg-white text-gold' : 'hover:bg-white'}`}>
                  <PackageIcon size={18} className="mr-3" />
                  <span>My Orders</span>
                </button>
                <button onClick={() => setActiveTab('wishlist')} className={`flex items-center w-full px-4 py-3 text-left ${activeTab === 'wishlist' ? 'bg-white text-gold' : 'hover:bg-white'}`}>
                  <HeartIcon size={18} className="mr-3" />
                  <span>Wishlist</span>
                </button>
                <button onClick={() => setActiveTab('addresses')} className={`flex items-center w-full px-4 py-3 text-left ${activeTab === 'addresses' ? 'bg-white text-gold' : 'hover:bg-white'}`}>
                  <MapPinIcon size={18} className="mr-3" />
                  <span>Addresses</span>
                </button>
                <button onClick={() => setActiveTab('payment')} className={`flex items-center w-full px-4 py-3 text-left ${activeTab === 'payment' ? 'bg-white text-gold' : 'hover:bg-white'}`}>
                  <CreditCardIcon size={18} className="mr-3" />
                  <span>Payment Methods</span>
                </button>
                <button onClick={() => setActiveTab('notifications')} className={`flex items-center w-full px-4 py-3 text-left ${activeTab === 'notifications' ? 'bg-white text-gold' : 'hover:bg-white'}`}>
                  <BellIcon size={18} className="mr-3" />
                  <span>Notifications</span>
                </button>
                <button onClick={() => setActiveTab('logout')} className="flex items-center w-full px-4 py-3 text-left text-gray-600 hover:bg-white hover:text-red-500">
                  <LogOutIcon size={18} className="mr-3" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </aside>
          {/* Content */}
          <div className="lg:col-span-3">
            {/* Orders */}
            {activeTab === 'orders' && <div>
                <h2 className="font-serif text-2xl mb-6">My Orders</h2>
                {orders.length === 0 ? <div className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 mb-4">
                      You haven't placed any orders yet.
                    </p>
                    <Link to="/products" className="btn btn-outline">
                      Start Shopping
                    </Link>
                  </div> : <div className="space-y-6">
                    {orders.map(order => <div key={order.id} className="border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500">
                              Placed on{' '}
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4">
                          {order.items.map((item, index) => <div key={index} className="flex justify-between py-2">
                              <span>
                                {item.name} × {item.quantity}
                              </span>
                            </div>)}
                          <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between font-medium">
                            <span>Total</span>
                            <span>KES {order.total.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                          <Link to={`/order/${order.id}`} className="btn btn-outline text-center text-sm py-2">
                            View Order Details
                          </Link>
                          {order.status === 'Delivered' && <button className="btn btn-outline text-center text-sm py-2">
                              Write a Review
                            </button>}
                        </div>
                      </div>)}
                  </div>}
              </div>}
            {/* Wishlist */}
            {activeTab === 'wishlist' && <div>
                <h2 className="font-serif text-2xl mb-6">My Wishlist</h2>
                {wishlist.length === 0 ? <div className="text-center py-12 bg-gray-50">
                    <p className="text-gray-500 mb-4">
                      Your wishlist is empty.
                    </p>
                    <Link to="/products" className="btn btn-outline">
                      Discover Products
                    </Link>
                  </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlist.map(product => <div key={product.id} className="border border-gray-200 group">
                        <div className="relative overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" />
                          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500">
                            <HeartIcon size={18} fill="currentColor" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-1">{product.name}</h3>
                          <p className="text-gold mb-4">
                            KES {product.price.toLocaleString()}
                          </p>
                          <Link to={`/products/${product.id}`} className="btn btn-primary w-full text-center text-sm py-2">
                            View Product
                          </Link>
                        </div>
                      </div>)}
                  </div>}
              </div>}
            {/* Addresses */}
            {activeTab === 'addresses' && <div>
                <h2 className="font-serif text-2xl mb-6">My Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {addresses.map(address => <div key={address.id} className="border border-gray-200 p-6">
                      <div className="flex justify-between mb-4">
                        <h3 className="font-medium">{address.name}</h3>
                        {address.isDefault && <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Default
                          </span>}
                      </div>
                      <div className="text-gray-600 space-y-1 mb-6">
                        <p>{address.address}</p>
                        <p>
                          {address.city}, {address.postalCode}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button className="text-sm font-medium hover:text-gold">
                          Edit
                        </button>
                        {!address.isDefault && <>
                            <span className="text-gray-300">|</span>
                            <button className="text-sm font-medium hover:text-gold">
                              Set as Default
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-sm font-medium hover:text-red-500">
                              Delete
                            </button>
                          </>}
                      </div>
                    </div>)}
                </div>
                <button className="btn btn-outline">Add New Address</button>
              </div>}
            {/* Payment Methods */}
            {activeTab === 'payment' && <div>
                <h2 className="font-serif text-2xl mb-6">Payment Methods</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {paymentMethods.map(method => <div key={method.id} className="border border-gray-200 p-6">
                      <div className="flex justify-between mb-4">
                        <h3 className="font-medium">{method.name}</h3>
                        {method.isDefault && <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Default
                          </span>}
                      </div>
                      <div className="text-gray-600 space-y-1 mb-6">
                        {method.type === 'card' && <p>Expires {method.expiryDate}</p>}
                        {method.type === 'mpesa' && <p>{method.phone}</p>}
                      </div>
                      <div className="flex space-x-3">
                        {method.type === 'card' && <button className="text-sm font-medium hover:text-gold">
                            Edit
                          </button>}
                        {!method.isDefault && <>
                            <span className="text-gray-300">|</span>
                            <button className="text-sm font-medium hover:text-gold">
                              Set as Default
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-sm font-medium hover:text-red-500">
                              Delete
                            </button>
                          </>}
                      </div>
                    </div>)}
                </div>
                <button className="btn btn-outline">
                  Add New Payment Method
                </button>
              </div>}
            {/* Notifications */}
            {activeTab === 'notifications' && <div>
                <h2 className="font-serif text-2xl mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-6">
                  <div className="border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Email Notifications</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Receive emails about your orders, account updates, and
                      promotions.
                    </p>
                  </div>
                  <div className="border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">SMS Notifications</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Receive SMS about your orders and delivery updates.
                    </p>
                  </div>
                  <div className="border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Marketing Emails</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Receive promotional emails about new products, sales, and
                      events.
                    </p>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default AccountPage;