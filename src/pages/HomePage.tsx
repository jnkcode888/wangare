import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShoppingCartIcon } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { Product } from '../lib/supabase';
import SocialMediaSection from '../components/SocialMediaSection';
const HomePage: React.FC = () => {
  const { products } = useProducts();
  const { addItem, showAddToCartConfirmation } = useCart();

  const categories = [{
    id: 'bags',
    name: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Signature WangarèLuxe bags, totes, and accessories'
  }, {
    id: 'perfumes',
    name: 'Perfumes',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Captivating scents for every occasion'
  }, {
    id: 'jewelry',
    name: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Timeless elegance in every piece'
  }, {
    id: 'home',
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Silk pillowcases and luxe candles for your sanctuary'
  }, {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3',
    description: 'Sunglasses, AirPod cases, and chic accessories'
  }, {
    id: 'bridal',
    name: 'Bridal',
    image: '/ten.png',
    description: 'Elegant pieces for your special day'
  }];

  // Get first 4 products as featured
  const featuredProducts = products.slice(0, 4);

  const handleAddToCart = (product: Product) => {
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
  return <div className="bg-white w-full">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Luxury fashion" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative container-luxe h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-4">
            Timeless Luxury
          </h1>
          <p className="text-lg md:text-xl max-w-lg mb-8">
            Discover the exquisite collection of WangarèLuxe, where elegance
            meets craftsmanship.
          </p>
          <Link to="/products" className="btn bg-white text-luxe-black hover:bg-gold hover:text-white">
            Shop Now
          </Link>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-20">
        <div className="container-luxe">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
            Discover Our Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => <Link to={`/products?category=${category.id}`} key={category.id} className="group">
                <div className="relative overflow-hidden mb-4">
                  <img src={category.image} alt={category.name} className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-serif text-xl mb-1">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {category.description}
                </p>
                <div className="flex items-center text-sm font-medium">
                  <span>Explore</span>
                  <ArrowRightIcon size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>)}
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 md:mb-0">
              Featured Products
            </h2>
            <Link to="/products" className="text-sm font-medium flex items-center hover:text-gold">
              View All Products
              <ArrowRightIcon size={16} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id} className="group">
                <Link to={`/products/${product.id}`} className="block">
                  <div className="relative overflow-hidden mb-4">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" 
                      onError={(e) => {
                        console.error('Featured product image failed to load:', product.name, product.image_url);
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
                  className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCartIcon size={14} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Brand Story */}
      <section className="py-20">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                The WangarèLuxe Story
              </h2>
              <p className="text-gray-700 mb-4">
                Founded in 2025 by a Kenyan woman named Wangari Kairu, WangarèLuxe was born from more than just a love for design—it was born from resilience.
              </p>
              <p className="text-gray-700 mb-4">
                After walking through a deeply challenging season in my life, I turned to creativity as a way to heal, rebuild, and rediscover my sense of purpose. What began as sketches and small ideas slowly grew into a brand that celebrates not only timeless luxury but also the strength that comes from starting again.
              </p>
              <p className="text-gray-700 mb-6">
                WangarèLuxe stands as a reminder that luxury is not only about what we wear, but also about the journey, courage, and authenticity behind it. Because true luxury is not just what you wear—it's how you live, and how you choose to show up for yourself every day.
              </p>
              <Link to="/about" className="btn btn-outline">
                Learn More About Us
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-blush opacity-30 rounded-full -z-10"></div>
              <img src="/wang.png" alt="WangarèLuxe craftsmanship" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-blush-light">
        <div className="container-luxe">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            text: "The quality of my WangarèLuxe bag is exceptional. I've received so many compliments, and it's become my everyday essential.",
            author: 'Sarah M.',
            location: 'Nairobi'
          }, {
            text: 'The silk pillowcases have completely transformed my sleep routine. They feel incredibly luxurious and my hair has never looked better in the morning.',
            author: 'Amina K.',
            location: 'Mombasa'
          }, {
            text: "I purchased the gold pearl earrings for my wedding day and they were absolutely perfect. Timeless elegance that I'll treasure forever.",
            author: 'Lisa J.',
            location: 'Nakuru'
          }].map((testimonial, index) => <div key={index} className="bg-white p-8 shadow-sm">
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map(star => <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>)}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.text}"</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      {/* Social Media Section */}
      <SocialMediaSection 
        showTikTok={true}
        instagramHandle="wangareluxe"
        tiktokHandle="wangareluxe"
      />
    </div>;
};
export default HomePage;