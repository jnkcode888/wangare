import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersIcon, XIcon, ChevronDownIcon, ShoppingCartIcon } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  
  const { products, loading, error } = useProducts();
  const { addItem, showAddToCartConfirmation } = useCart();

  // Filter products by category if category param exists
  const filteredProducts = categoryParam 
    ? products.filter(product => product.category === categoryParam) 
    : products;

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1
    };
    addItem(cartItem);
    showAddToCartConfirmation(cartItem);
  };
  const categories = [{
    id: 'bags',
    name: 'Bags'
  }, {
    id: 'perfumes',
    name: 'Perfumes'
  }, {
    id: 'jewelry',
    name: 'Jewelry'
  }, {
    id: 'home',
    name: 'Home'
  }, {
    id: 'accessories',
    name: 'Accessories'
  }, {
    id: 'bridal',
    name: 'Bridal'
  }];
  const priceRanges = [{
    id: 'under-5000',
    name: 'Under KES 5,000'
  }, {
    id: '5000-10000',
    name: 'KES 5,000 - 10,000'
  }, {
    id: 'over-10000',
    name: 'Over KES 10,000'
  }];
  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]);
  };
  return <div className="bg-white w-full">
      {/* Page Header */}
      <div className="bg-gray-50 py-12">
        <div className="container-luxe">
          <h1 className="font-serif text-3xl md:text-4xl text-center">
            {categoryParam ? categories.find(c => c.id === categoryParam)?.name : 'All Products'}
          </h1>
        </div>
      </div>
      {/* Filters and Products */}
      <div className="container-luxe py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button onClick={() => setIsFilterOpen(true)} className="flex items-center text-sm font-medium">
              <SlidersIcon size={16} className="mr-2" />
              Filter & Sort
            </button>
            <div className="text-sm text-gray-500">
              {filteredProducts.length} products
            </div>
          </div>
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="font-serif text-lg mb-6">Filter Products</h2>
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(category => <li key={category.id}>
                      <Link to={`/products?category=${category.id}`} className={`block text-sm ${categoryParam === category.id ? 'text-gold font-medium' : 'text-gray-700 hover:text-gold'}`}>
                        {category.name}
                      </Link>
                    </li>)}
                </ul>
              </div>
              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">Price Range</h3>
                <ul className="space-y-2">
                  {priceRanges.map(range => <li key={range.id} className="flex items-center">
                      <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" className="mr-2 h-4 w-4 border-gray-300 rounded text-gold focus:ring-gold" checked={activeFilters.includes(range.id)} onChange={() => toggleFilter(range.id)} />
                        {range.name}
                      </label>
                    </li>)}
                </ul>
              </div>
              {/* Sort By */}
              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full text-sm border-gray-300 rounded-sm focus:border-gold focus:ring-0">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </aside>
          {/* Mobile Filter Sidebar */}
          {isFilterOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif text-lg">Filter & Sort</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <XIcon size={20} />
                  </button>
                </div>
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <ul className="space-y-3">
                    {categories.map(category => <li key={category.id}>
                        <Link to={`/products?category=${category.id}`} className={`block text-sm ${categoryParam === category.id ? 'text-gold font-medium' : 'text-gray-700'}`} onClick={() => setIsFilterOpen(false)}>
                          {category.name}
                        </Link>
                      </li>)}
                  </ul>
                </div>
                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <ul className="space-y-3">
                    {priceRanges.map(range => <li key={range.id} className="flex items-center">
                        <label className="flex items-center text-sm text-gray-700">
                          <input type="checkbox" className="mr-2 h-4 w-4 border-gray-300 rounded text-gold focus:ring-gold" checked={activeFilters.includes(range.id)} onChange={() => toggleFilter(range.id)} />
                          {range.name}
                        </label>
                      </li>)}
                  </ul>
                </div>
                {/* Sort By */}
                <div className="mb-8">
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full text-sm border-gray-300 rounded-sm focus:border-gold focus:ring-0">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button onClick={() => setIsFilterOpen(false)} className="w-full btn btn-primary">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>}
          {/* Products Grid */}
          <div className="flex-grow">
            {/* Desktop Sort */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <div className="text-sm text-gray-500">
                {filteredProducts.length} products
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">Sort by:</span>
                <div className="relative">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none bg-transparent border-0 text-sm font-medium pr-8 focus:outline-none focus:ring-0">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDownIcon size={16} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Products */}
            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <h3 className="font-serif text-2xl mb-4">Error Loading Products</h3>
                <p className="text-gray-500 mb-8">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="font-serif text-2xl mb-4">No Products Found</h3>
                <p className="text-gray-500 mb-8">
                  Try adjusting your filters or browse our other categories.
                </p>
                <Link to="/products" className="btn btn-outline">
                  View All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group">
                    <Link to={`/products/${product.id}`} className="block">
                    <div className="relative overflow-hidden mb-4">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" 
                          onError={(e) => {
                            console.error('Product image failed to load:', product.name, product.image_url);
                            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                          }}
                        />
                    </div>
                    </Link>
                    <h3 className="font-medium mb-1">
                      <Link to={`/products/${product.id}`} className="hover:text-gold">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-gold mb-3">
                      KES {product.price.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <ShoppingCartIcon size={16} />
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>;
};
export default ProductsPage;