import React from 'react';
import { Link } from 'react-router-dom';
import { TruckIcon, PackageIcon, HelpCircleIcon } from 'lucide-react';
const DeliveryPage: React.FC = () => {
  return <div className="bg-white w-full">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-luxe text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Delivery & Returns
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Everything you need to know about our shipping and returns policies.
          </p>
        </div>
      </section>
      {/* Info Cards */}
      <section className="py-16">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon size={24} className="text-gold" />
              </div>
              <h3 className="font-medium text-lg mb-2">Free Delivery</h3>
              <p className="text-gray-600">
                Enjoy complimentary shipping on all orders above KES 5,000
              </p>
            </div>
            <div className="border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-medium text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600">
                Return any item within 14 days for a full refund
              </p>
            </div>
            <div className="border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageIcon size={24} className="text-gold" />
              </div>
              <h3 className="font-medium text-lg mb-2">Secure Packaging</h3>
              <p className="text-gray-600">
                All items are carefully packaged to ensure safe delivery
              </p>
            </div>
            <div className="border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircleIcon size={24} className="text-gold" />
              </div>
              <h3 className="font-medium text-lg mb-2">Customer Support</h3>
              <p className="text-gray-600">
                Our team is available to assist with any inquiries
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Delivery Information */}
      <section className="py-16 bg-gray-50">
        <div className="container-luxe">
          <h2 className="font-serif text-3xl mb-10 text-center">
            Delivery Information
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl mb-3">Domestic Shipping</h3>
                <p className="text-gray-600 mb-4">
                  We offer the following shipping options for deliveries within
                  Kenya:
                </p>
                <div className="border-t border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200">
                    <div className="font-medium md:col-span-1">
                      Standard Shipping
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      3-5 business days
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      KES 500 (Free for orders above KES 5,000)
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200">
                    <div className="font-medium md:col-span-1">
                      Express Shipping
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      1-2 business days
                    </div>
                    <div className="md:col-span-1 text-gray-600">KES 800</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                    <div className="font-medium md:col-span-1">
                      Same-Day Delivery
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      Available in Nairobi only (order before 10 AM)
                    </div>
                    <div className="md:col-span-1 text-gray-600">KES 1,200</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">
                  International Shipping
                </h3>
                <p className="text-gray-600 mb-4">
                  We ship to select countries worldwide. International shipping
                  rates and delivery times vary by location:
                </p>
                <div className="border-t border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200">
                    <div className="font-medium md:col-span-1">East Africa</div>
                    <div className="md:col-span-1 text-gray-600">
                      5-7 business days
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      From KES 2,000
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200">
                    <div className="font-medium md:col-span-1">
                      Rest of Africa
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      7-10 business days
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      From KES 3,500
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 py-4">
                    <div className="font-medium md:col-span-1">
                      International
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      10-14 business days
                    </div>
                    <div className="md:col-span-1 text-gray-600">
                      From KES 5,000
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Please note that international orders may be subject to import
                  duties and taxes, which are the responsibility of the
                  recipient.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">Tracking Your Order</h3>
                <p className="text-gray-600">
                  Once your order has been dispatched, you will receive a
                  confirmation email with tracking information. You can also
                  track your order by logging into your account or contacting
                  our customer service team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Returns Policy */}
      <section className="py-16">
        <div className="container-luxe">
          <h2 className="font-serif text-3xl mb-10 text-center">
            Returns Policy
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl mb-3">Return Process</h3>
                <p className="text-gray-600 mb-4">
                  We want you to be completely satisfied with your purchase. If
                  you're not happy with your order, you can return it within 14
                  days of receipt for a full refund or exchange, subject to the
                  following conditions:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>
                    Items must be in their original condition with all tags
                    attached
                  </li>
                  <li>Items must be unworn, unwashed, and undamaged</li>
                  <li>Original packaging must be intact</li>
                  <li>
                    A completed return form must accompany the returned items
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">How to Return</h3>
                <ol className="list-decimal pl-5 space-y-4 text-gray-600">
                  <li>
                    <span className="font-medium">Request a Return:</span>
                    <p className="mt-1">
                      Log into your account and navigate to your order history,
                      or contact our customer service team to initiate a return.
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Package Your Return:</span>
                    <p className="mt-1">
                      Carefully pack the item(s) in the original packaging along
                      with the completed return form.
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Ship Your Return:</span>
                    <p className="mt-1">
                      Use the prepaid shipping label provided (for domestic
                      returns) or send the package to the address on the return
                      form.
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Refund Processing:</span>
                    <p className="mt-1">
                      Once we receive and inspect your return, we will process
                      your refund to the original payment method within 5-7
                      business days.
                    </p>
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">
                  Non-Returnable Items
                </h3>
                <p className="text-gray-600 mb-4">
                  The following items cannot be returned:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Custom or personalized items</li>
                  <li>Sale items marked as final sale</li>
                  <li>Gift cards</li>
                  <li>Intimate items (for hygiene reasons)</li>
                  <li>Items damaged due to customer misuse</li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-3">Exchanges</h3>
                <p className="text-gray-600">
                  If you would like to exchange an item for a different size or
                  color, please indicate this on your return form. If the
                  requested item is available, we will ship it to you as soon as
                  we receive your return. If the item is unavailable, we will
                  process a refund.
                </p>
              </div>
            </div>
            <div className="mt-10 p-6 bg-gray-50 text-center">
              <p className="text-gray-600 mb-4">
                Have questions about our delivery or returns policies? Our
                customer service team is here to help.
              </p>
              <Link to="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default DeliveryPage;