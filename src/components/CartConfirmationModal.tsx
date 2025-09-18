import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, ShoppingCartIcon, XIcon } from 'lucide-react';

interface CartConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
  onGoToCart: () => void;
}

const CartConfirmationModal: React.FC<CartConfirmationModalProps> = ({
  isOpen,
  onClose,
  productName,
  productImage,
  onGoToCart
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToCart = () => {
    navigate('/cart');
    onClose();
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Added to Cart!</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Image';
                }}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{productName}</h4>
              <p className="text-sm text-gray-600">Successfully added to your cart</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleContinueShopping}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleGoToCart}
              className="flex-1 px-4 py-2 bg-gold text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ShoppingCartIcon size={16} />
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartConfirmationModal;
