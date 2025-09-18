import React from 'react';
import { useCart } from '../context/CartContext';
import CartConfirmationModal from './CartConfirmationModal';

const CartModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    showConfirmationModal,
    confirmationProduct,
    hideAddToCartConfirmation
  } = useCart();

  return (
    <>
      {children}
      <CartConfirmationModal
        isOpen={showConfirmationModal}
        onClose={hideAddToCartConfirmation}
        productName={confirmationProduct?.name || ''}
        productImage={confirmationProduct?.image || ''}
        onGoToCart={() => {
          // Navigation is handled by the Link component in the modal
        }}
      />
    </>
  );
};

export default CartModalProvider;
