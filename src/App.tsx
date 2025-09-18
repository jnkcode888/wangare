import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DeliveryPage from './pages/DeliveryPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import CartModalProvider from './components/CartModalProvider';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
export function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <AdminAuthProvider>
      <CartProvider>
        <NotificationsProvider>
          <div className="flex flex-col min-h-screen bg-white">
          {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
          <BrowserRouter>
            <ScrollToTop />
            <CartModalProvider>
              <Routes>
              {/* Admin routes without header/footer */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <AdminPage />
                  </ProtectedAdminRoute>
                } 
              />
              
              {/* Main site routes with header/footer */}
              <Route 
                path="/*" 
                element={
                  <>
                    <Header />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/delivery" element={<DeliveryPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                } 
              />
              </Routes>
            </CartModalProvider>
          </BrowserRouter>
          </div>
        </NotificationsProvider>
      </CartProvider>
    </AdminAuthProvider>
  );
}