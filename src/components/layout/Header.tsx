import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBagIcon, UserIcon, HeartIcon, MenuIcon, SearchIcon, XIcon } from 'lucide-react';
const Header: React.FC = () => {
  const {
    totalItems
  } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return <>
      {/* Promo Banner */}
      <div className="bg-gold-light text-luxe-black py-2 text-center text-sm font-medium">
        Free delivery on orders above 5,000 KES
      </div>
      <header className="bg-white border-b border-gray-100">
        <div className="container-luxe">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="p-2" aria-label="Open menu">
              <MenuIcon size={20} />
            </button>
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="WangarèLuxe" 
                className="h-16 w-16 object-contain"
              />
              <span className="ml-3 font-serif text-2xl font-medium">WangarèLuxe</span>
            </Link>
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsSearchOpen(true)} className="p-2" aria-label="Search">
                <SearchIcon size={20} />
              </button>
              <Link to="/cart" className="p-2 relative">
                <ShoppingBagIcon size={20} />
                {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>}
              </Link>
            </div>
          </div>
          {/* Desktop Header */}
          <div className="hidden md:flex md:items-center md:justify-between py-6">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="WangarèLuxe" 
                  className="h-16 w-16 object-contain"
                />
                <span className="ml-3 font-serif text-2xl font-medium">WangarèLuxe</span>
              </Link>
              <nav className="hidden lg:flex space-x-6 text-sm font-medium">
                <Link to="/products?category=bags" className="hover:text-gold">
                  Bags
                </Link>
                <Link to="/products?category=perfumes" className="hover:text-gold">
                  Perfumes
                </Link>
                <Link to="/products?category=jewelry" className="hover:text-gold">
                  Jewelry
                </Link>
                <Link to="/products?category=home" className="hover:text-gold">
                  Home
                </Link>
                <Link to="/products?category=accessories" className="hover:text-gold">
                  Accessories
                </Link>
                <Link to="/products?category=bridal" className="hover:text-gold">
                  Bridal
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-5">
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-gold" aria-label="Search">
                <SearchIcon size={20} />
              </button>
              <Link to="/cart" className="relative hover:text-gold">
                <ShoppingBagIcon size={20} />
                {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>}
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      {isMenuOpen && <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="container-luxe py-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2" aria-label="Close menu">
                <XIcon size={20} />
              </button>
            </div>
            <nav className="flex flex-col space-y-6 text-lg">
              <Link to="/products?category=bags" onClick={() => setIsMenuOpen(false)}>
                Bags
              </Link>
              <Link to="/products?category=perfumes" onClick={() => setIsMenuOpen(false)}>
                Perfumes
              </Link>
              <Link to="/products?category=jewelry" onClick={() => setIsMenuOpen(false)}>
                Jewelry
              </Link>
              <Link to="/products?category=home" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products?category=accessories" onClick={() => setIsMenuOpen(false)}>
                Accessories
              </Link>
              <Link to="/products?category=bridal" onClick={() => setIsMenuOpen(false)}>
                Bridal
              </Link>
              <div className="border-t border-gray-100 pt-4 mt-4"></div>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/delivery" onClick={() => setIsMenuOpen(false)}>
                Delivery & Returns
              </Link>
            </nav>
          </div>
        </div>}
      {/* Search Overlay */}
      {isSearchOpen && <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="container-luxe py-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">Search</h2>
              <button onClick={() => setIsSearchOpen(false)} className="p-2" aria-label="Close search">
                <XIcon size={20} />
              </button>
            </div>
            <div className="relative">
              <input type="text" placeholder="Search for products..." className="w-full border-b border-gray-300 py-3 pl-10 pr-4 focus:outline-none focus:border-gold" autoFocus />
              <SearchIcon size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>}
    </>;
};
export default Header;