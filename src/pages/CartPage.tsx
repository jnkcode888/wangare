import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MinusIcon, PlusIcon, TrashIcon, ChevronRightIcon } from 'lucide-react';
const CartPage: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal
  } = useCart();
  // Calculate shipping cost
  const shippingCost = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shippingCost;
  if (items.length === 0) {
    return <div className="bg-white w-full min-h-[60vh] flex flex-col items-center justify-center py-16">
        <div className="text-center max-w-md px-4">
          <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
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
            <span className="text-gray-700">Shopping Cart</span>
          </div>
        </div>
      </div>
      <div className="container-luxe py-12">
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200 pb-2 mb-6 hidden md:grid md:grid-cols-12 text-sm font-medium">
              <div className="md:col-span-6">Product</div>
              <div className="md:col-span-2 text-center">Price</div>
              <div className="md:col-span-2 text-center">Quantity</div>
              <div className="md:col-span-2 text-right">Total</div>
            </div>
            {items.map(item => <div key={item.id} className="border-b border-gray-100 py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Product */}
                <div className="md:col-span-6 flex items-center">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4">
                    <Link to={`/products/${item.id}`} className="font-medium hover:text-gold">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.id)} className="flex items-center text-sm text-gray-500 hover:text-red-500 mt-2">
                      <TrashIcon size={14} className="mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
                {/* Price */}
                <div className="md:col-span-2 text-center">
                  <div className="md:hidden text-sm text-gray-500 mb-1">
                    Price:
                  </div>
                  <div>KES {item.price.toLocaleString()}</div>
                </div>
                {/* Quantity */}
                <div className="md:col-span-2 flex justify-center">
                  <div className="md:hidden text-sm text-gray-500 mb-1 mr-2">
                    Quantity:
                  </div>
                  <div className="flex">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="border border-gray-300 px-2 py-1 flex items-center justify-center">
                      <MinusIcon size={14} />
                    </button>
                    <div className="border-t border-b border-gray-300 px-4 py-1 flex items-center justify-center min-w-[40px]">
                      {item.quantity}
                    </div>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="border border-gray-300 px-2 py-1 flex items-center justify-center">
                      <PlusIcon size={14} />
                    </button>
                  </div>
                </div>
                {/* Total */}
                <div className="md:col-span-2 text-right">
                  <div className="md:hidden text-sm text-gray-500 mb-1">
                    Total:
                  </div>
                  <div className="font-medium">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>)}
            {/* Continue Shopping */}
            <div className="mt-8">
              <Link to="/products" className="text-sm font-medium flex items-center hover:text-gold">
                <ChevronRightIcon size={16} className="mr-1 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-8">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>
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
              <Link to="/checkout" className="btn btn-primary w-full mb-4">
                Proceed to Checkout
              </Link>
              <div className="text-sm text-gray-500 text-center">
                <p>We accept M-Pesa, Visa, Mastercard, and PayPal</p>
                <div className="flex justify-center mt-3">
                  <img src="https://i.imgur.com/SN2hUdK.png" alt="Payment methods" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default CartPage;