import React, { useState, createContext, useContext } from 'react';
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};
type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  // Modal state
  showConfirmationModal: boolean;
  confirmationProduct: CartItem | null;
  showAddToCartConfirmation: (product: CartItem) => void;
  hideAddToCartConfirmation: () => void;
};
const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationProduct, setConfirmationProduct] = useState<CartItem | null>(null);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => i.id === item.id ? {
          ...i,
          quantity: i.quantity + item.quantity
        } : i);
      }
      return [...prevItems, item];
    });
  };

  const showAddToCartConfirmation = (product: CartItem) => {
    setConfirmationProduct(product);
    setShowConfirmationModal(true);
  };

  const hideAddToCartConfirmation = () => {
    setShowConfirmationModal(false);
    setConfirmationProduct(null);
  };
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  const updateQuantity = (id: string, quantity: number) => {
    setItems(prevItems => prevItems.map(item => item.id === id ? {
      ...item,
      quantity
    } : item));
  };
  const clearCart = () => {
    setItems([]);
  };
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return <CartContext.Provider value={{
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    showConfirmationModal,
    confirmationProduct,
    showAddToCartConfirmation,
    hideAddToCartConfirmation
  }}>
    {children}
  </CartContext.Provider>;
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};