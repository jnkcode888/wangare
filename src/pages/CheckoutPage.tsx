import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { ChevronRightIcon, CheckIcon, UploadIcon, CreditCardIcon } from 'lucide-react';
import { createOrder, OrderFormData } from '../services/orderService';
import { sendOrderConfirmation } from '../services/apiEmailService';
type FormData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  transactionCode?: string;
  transactionScreenshot?: FileList;
};

const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ receiptNumber: string; emailSent: boolean } | null>(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

  // Calculate shipping cost
  const shippingCost = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shippingCost;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log('Form data:', data);
      console.log('Screenshot file:', data.transactionScreenshot?.[0]);
      
      const orderData: OrderFormData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryAddress: data.deliveryAddress,
        transactionCode: data.transactionCode,
        transactionScreenshot: data.transactionScreenshot?.[0],
      };

      const { receiptNumber } = await createOrder(items, orderData, total);
      
      // Send confirmation email
      let emailSent = false;
      try {
        console.log('Sending order confirmation email to:', data.customerEmail);
        const emailResult = await sendOrderConfirmation({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          orderNumber: receiptNumber,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: total
        });

        if (emailResult.success) {
          console.log('Order confirmation email sent successfully');
          emailSent = true;
        } else {
          console.error('Order confirmation email failed:', emailResult.error);
          // Don't block the order process if email fails
        }
      } catch (emailError) {
        console.error('Order confirmation email error:', emailError);
        // Don't block the order process if email fails
      }

      setOrderResult({ receiptNumber, emailSent });
      setStep(3);
      clearCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (items.length === 0 && step === 1) {
    return <div className="bg-white w-full min-h-[60vh] flex flex-col items-center justify-center py-16">
        <div className="text-center max-w-md px-4">
          <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            You need to add items to your cart before checkout.
          </p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>;
  }
  return <div className="bg-white w-full">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="container-luxe">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-gold">
              Home
            </Link>
            <ChevronRightIcon size={14} className="mx-2 text-gray-400" />
            <Link to="/cart" className="text-gray-500 hover:text-gold">
              Cart
            </Link>
            <ChevronRightIcon size={14} className="mx-2 text-gray-400" />
            <span className="text-gray-700">Checkout</span>
          </div>
        </div>
      </div>
      <div className="container-luxe py-12">
        {step === 1 && (
          <>
            <h1 className="font-serif text-3xl md:text-4xl mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Customer Information */}
                  <div className="mb-10">
                    <h2 className="font-serif text-xl mb-6">Customer Information</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="customerName" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="customerName"
                          {...register('customerName', { required: 'Full name is required' })}
                          className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold"
                        />
                        {errors.customerName && (
                          <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                        )}
                      </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="customerEmail" className="block text-sm font-medium mb-2">
                            Email Address *
                        </label>
                          <input
                            type="email"
                            id="customerEmail"
                            {...register('customerEmail', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold"
                          />
                          {errors.customerEmail && (
                            <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                          )}
                      </div>
                      <div>
                          <label htmlFor="customerPhone" className="block text-sm font-medium mb-2">
                            Phone Number *
                        </label>
                          <input
                            type="tel"
                            id="customerPhone"
                            {...register('customerPhone', { required: 'Phone number is required' })}
                            className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold"
                            placeholder="+254 XXX XXX XXX"
                          />
                          {errors.customerPhone && (
                            <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                          )}
                      </div>
                      </div>
                      <div>
                        <label htmlFor="deliveryAddress" className="block text-sm font-medium mb-2">
                          Delivery Address (Optional)
                        </label>
                        <textarea
                          id="deliveryAddress"
                          {...register('deliveryAddress')}
                          rows={3}
                          className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold"
                          placeholder="Enter your full delivery address including building, street, city, and any special instructions"
                        />
                      </div>
                    </div>
                  </div>

                  {!showPaymentInstructions && (
                    <button
                      type="button"
                      onClick={() => setShowPaymentInstructions(true)}
                      className="btn btn-primary mb-6"
                    >
                      Proceed to Payment
                    </button>
                  )}

                  {showPaymentInstructions && (
                    <>
                      {/* Payment Instructions */}
                      <div className="mb-10 p-6 bg-green-50 border border-green-200 rounded-lg">
                        <h2 className="font-serif text-xl mb-4 flex items-center">
                          <CreditCardIcon className="mr-2" size={20} />
                          Payment Instructions
                        </h2>
                        <div className="text-green-800">
                          <p className="mb-2">
                            <strong>Pay KES {total.toLocaleString()} to Till Number: 8508958 (CYNTHIA MARY WANGARI)</strong>
                          </p>
                          <p className="text-sm mb-4">
                            Use M-Pesa SIM Toolkit or MySafaricom App to make your payment.
                          </p>
                          <ol className="text-sm list-decimal list-inside space-y-1">
                            <li>Go to M-Pesa on your phone</li>
                            <li>Select "Lipa na M-Pesa"</li>
                            <li>Select "Buy Goods and Services"</li>
                            <li>Enter Till Number: <strong>8508958</strong></li>
                            <li>Enter Amount: <strong>KES {total.toLocaleString()}</strong></li>
                            <li>Enter your M-Pesa PIN</li>
                            <li>You will receive an SMS confirmation</li>
                          </ol>
                          </div>
                      </div>

                      {/* Payment Confirmation */}
                      <div className="mb-10">
                        <h2 className="font-serif text-xl mb-6">Confirm Your Payment</h2>
                        <p className="text-gray-600 mb-4">
                          After making your payment, please confirm it by either entering your M-Pesa transaction code or uploading a screenshot of your M-Pesa SMS.
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="transactionCode" className="block text-sm font-medium mb-2">
                              M-Pesa Transaction Code (Optional)
                            </label>
                            <input
                              type="text"
                              id="transactionCode"
                              {...register('transactionCode')}
                              className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold"
                              placeholder="e.g., QA12B3C4D5"
                            />
                          </div>

                          <div className="text-center text-gray-500">OR</div>

                              <div>
                            <label htmlFor="transactionScreenshot" className="block text-sm font-medium mb-2">
                              Upload M-Pesa SMS Screenshot (Optional)
                                </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <UploadIcon className="mx-auto mb-2" size={24} />
                              <input
                                type="file"
                                id="transactionScreenshot"
                                {...register('transactionScreenshot', {
                                  onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      console.log('File selected:', file.name, file.size, file.type);
                                    }
                                  }
                                })}
                                accept="image/*"
                                className="hidden"
                              />
                              <label 
                                htmlFor="transactionScreenshot"
                                className="cursor-pointer text-sm text-gray-600 hover:text-gold"
                              >
                                Click to upload or drag and drop
                                  </label>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG up to 10MB
                              </p>
                              {watch('transactionScreenshot')?.[0] && (
                                <div className="mt-2 text-sm text-green-600">
                                  ✓ {watch('transactionScreenshot')?.[0]?.name} selected
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full"
                      >
                        {isSubmitting ? 'Submitting Order...' : 'Submit Payment & Complete Order'}
                  </button>
                    </>
                  )}
                </form>
              </div>
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 sticky top-8">
                  <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                  {/* Order Items */}
                  <div className="max-h-64 overflow-y-auto mb-6">
                    {items.map(item => <div key={item.id} className="flex items-center py-3 border-b border-gray-200 last:border-0">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          <div className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>)}
                  </div>
                  {/* Totals */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        KES {subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'Free' : `KES ${shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>KES {total.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Including VAT
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && orderResult && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckIcon size={32} className="text-green-600" />
              </div>
            </div>
            <h1 className="font-serif text-3xl mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-600 mb-4">
              Your order has been submitted successfully. We've received your payment details and will verify your M-Pesa transaction shortly.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <p className="font-medium text-lg mb-2">Receipt Number</p>
              <p className="text-2xl font-serif text-gold">{orderResult.receiptNumber}</p>
            </div>
            <div className="text-left max-w-md mx-auto mb-8">
              <h3 className="font-medium mb-4">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className={orderResult.emailSent ? "text-green-600" : "text-yellow-600"}>
                  {orderResult.emailSent ? "✓" : "⏳"} Email confirmation {orderResult.emailSent ? "sent" : "being sent"} to your email address
                </li>
                <li>⏳ We'll verify your M-Pesa payment (usually within 1-2 hours)</li>
                <li>📧 You'll get an email update once payment is confirmed</li>
                <li>📦 Your order will be prepared and shipped</li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">📧 Important: Check Your Email</h4>
                <p className="text-sm text-yellow-800 mb-3">
                  <strong>To ensure you receive our emails:</strong>
                </p>
                <ul className="text-sm text-yellow-800 space-y-1 mb-3">
                  <li>1. Check your spam/junk folder first</li>
                  <li>2. Add <strong>info@wangareluxe.com</strong> to your contacts</li>
                  <li>3. Mark our emails as "Not Spam" if they go to spam</li>
                  <li>4. Whitelist our domain in your email settings</li>
                </ul>
                {!orderResult.emailSent && (
                  <p className="text-sm text-red-800 mt-2 p-2 bg-red-50 rounded">
                    <strong>Note:</strong> Email delivery may take a few minutes. If you don't receive it within 10 minutes, please contact us at info@wangareluxe.com
                  </p>
                )}
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                  <strong>Why emails go to spam:</strong> Automated emails are often filtered by email providers. Following these steps ensures you receive all our communications.
                </div>
              </div>
            </div>
            <div className="space-y-3">
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
              <p className="text-sm text-gray-500">
                Questions? Contact us at support@wangariluxe.com
              </p>
            </div>
          </div>
        )}
      </div>
    </div>;
};
export default CheckoutPage;