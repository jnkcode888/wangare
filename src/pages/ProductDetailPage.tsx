import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HeartIcon, MinusIcon, PlusIcon, ShareIcon, ChevronRightIcon, StarIcon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, showAddToCartConfirmation } = useCart();
  const { getProductById, products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="bg-white w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Mock additional data that would come from database
  const productDetails = {
    ...product,
    description: product.description || 'Experience luxury with this exquisite piece from WangarèLuxe. Handcrafted with attention to detail and using only the finest materials.',
    features: ['Premium materials', 'Handcrafted quality', 'Elegant design', 'Perfect for special occasions'],
    colors: ['Black', 'Gold', 'Silver'],
    images: [product.image_url, product.image_url, product.image_url], // In real app, would have multiple images
    rating: 4.8,
    reviewCount: 42,
    inStock: true
  };
  // Get related products from the same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: quantity
    };
    addItem(cartItem);
    showAddToCartConfirmation(cartItem);
  };
  return <div className="bg-white w-full">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="container-luxe">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-gold">
              Home
            </Link>
            <ChevronRightIcon size={14} className="mx-2 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-gold">
              Products
            </Link>
            <ChevronRightIcon size={14} className="mx-2 text-gray-400" />
            <span className="text-gray-700">{productDetails.name}</span>
          </div>
        </div>
      </div>
      {/* Product Details */}
      <section className="py-12">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="mb-4 overflow-hidden">
                <img src={productDetails.images[selectedImage]} alt={productDetails.name} className="w-full aspect-square object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productDetails.images.map((image, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`overflow-hidden border-2 ${selectedImage === index ? 'border-gold' : 'border-transparent'}`}>
                    <img src={image} alt={`${productDetails.name} - View ${index + 1}`} className="w-full aspect-square object-cover" />
                  </button>)}
              </div>
            </div>
            {/* Product Info */}
            <div>
              <h1 className="font-serif text-3xl md:text-4xl mb-2">
                {productDetails.name}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} size={18} className={`${star <= Math.round(productDetails.rating) ? 'text-gold' : 'text-gray-300'}`} fill={star <= Math.round(productDetails.rating) ? 'currentColor' : 'none'} />)}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {productDetails.rating} ({productDetails.reviewCount} reviews)
                </span>
              </div>
              <p className="text-xl text-gold font-medium mb-6">
                KES {productDetails.price.toLocaleString()}
              </p>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">{productDetails.description}</p>
                <ul className="space-y-2">
                  {productDetails.features.map((feature, index) => <li key={index} className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>)}
                </ul>
              </div>
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Color</h3>
                <div className="flex space-x-3">
                  {productDetails.colors.map((color, index) => <button key={color} className={`px-4 py-2 border ${index === 0 ? 'border-gold bg-gold-light' : 'border-gray-300 hover:border-gold'}`}>
                      {color}
                    </button>)}
                </div>
              </div>
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Quantity</h3>
                <div className="flex">
                  <button onClick={decreaseQuantity} className="border border-gray-300 px-3 py-2 flex items-center justify-center" disabled={quantity === 1}>
                    <MinusIcon size={16} />
                  </button>
                  <div className="border-t border-b border-gray-300 px-6 py-2 flex items-center justify-center min-w-[60px]">
                    {quantity}
                  </div>
                  <button onClick={increaseQuantity} className="border border-gray-300 px-3 py-2 flex items-center justify-center">
                    <PlusIcon size={16} />
                  </button>
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button onClick={handleAddToCart} className="btn btn-primary flex-grow" disabled={!productDetails.inStock}>
                  <ShoppingCartIcon size={16} className="mr-2" />
                  {productDetails.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="btn btn-outline flex items-center justify-center">
                  <HeartIcon size={18} className="mr-2" />
                  Wishlist
                </button>
                <button className="btn btn-outline flex items-center justify-center sm:px-4">
                  <ShareIcon size={18} />
                  <span className="sr-only sm:not-sr-only sm:ml-2">Share</span>
                </button>
              </div>
              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-6 space-y-4 text-sm">
                <p className="flex items-start">
                  <span className="font-medium w-32">Shipping:</span>
                  <span className="text-gray-700">
                    Free shipping on orders over KES 5,000
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Returns:</span>
                  <span className="text-gray-700">
                    Free returns within 14 days
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">SKU:</span>
                  <span className="text-gray-700">WL-BAG-001</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Product Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="container-luxe">
          <div className="border-b border-gray-200 mb-8">
            <div className="flex overflow-x-auto">
              <button className="font-medium text-gold border-b-2 border-gold px-6 py-3 whitespace-nowrap">
                Details
              </button>
              <button className="font-medium text-gray-500 hover:text-gray-700 px-6 py-3 whitespace-nowrap">
                Reviews ({productDetails.reviewCount})
              </button>
              <button className="font-medium text-gray-500 hover:text-gray-700 px-6 py-3 whitespace-nowrap">
                Shipping & Returns
              </button>
            </div>
          </div>
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl mb-4">Product Details</h2>
            <p className="text-gray-700 mb-4">
              The Nairobi Tote is our signature bag, handcrafted from premium
              Italian leather. This spacious and elegant tote features a
              minimalist design with gold-tone hardware and our iconic Wangari
              Luxe monogram.
            </p>
            <p className="text-gray-700 mb-4">
              Each bag is meticulously crafted by skilled artisans, ensuring the
              highest quality and attention to detail. The interior is lined
              with our signature blush fabric and includes multiple compartments
              for organization.
            </p>
            <p className="text-gray-700 mb-4">
              Perfect for everyday use or special occasions, this timeless piece
              combines style and functionality, making it a must-have addition
              to your luxury collection.
            </p>
            <h3 className="font-medium text-lg mb-2 mt-6">Care Instructions</h3>
            <p className="text-gray-700 mb-4">
              To maintain the beauty of your WangarèLuxe leather goods, avoid
              exposure to direct sunlight, heat, and moisture. Clean with a
              soft, dry cloth and store in the provided dust bag when not in
              use.
            </p>
          </div>
        </div>
      </section>
      {/* Related Products */}
      <section className="py-16">
        <div className="container-luxe">
          <h2 className="font-serif text-3xl mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => <Link to={`/products/${relatedProduct.id}`} key={relatedProduct.id} className="group">
                <div className="relative overflow-hidden mb-4">
                  <img src={relatedProduct.image_url} alt={relatedProduct.name} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-medium mb-1">{relatedProduct.name}</h3>
                <p className="text-gold">
                  KES {relatedProduct.price.toLocaleString()}
                </p>
              </Link>)}
          </div>
        </div>
      </section>
    </div>;
};
export default ProductDetailPage;