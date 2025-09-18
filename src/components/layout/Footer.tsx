import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, TwitterIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubscriptionStatus('idle');

    try {
      const response = await fetch('https://wangari-2i5a8agct-soltechs-projects-a2f78e01.vercel.app/api/email?action=newsletter-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setSubscriptionStatus('success');
        setMessage('Welcome to WangarèLuxe Club! Check your email for a special discount.');
        setEmail('');
      } else {
        setSubscriptionStatus('error');
        setMessage(result.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setSubscriptionStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <footer className="bg-luxe-black text-white pt-16 pb-8">
      <div className="container-luxe">
        {/* Newsletter */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h3 className="font-serif text-2xl mb-3">Join WangarèLuxe Club</h3>
          <p className="text-gray-300 mb-6">
            Sign up for exclusive deals, new arrivals, and 10% off your first
            order
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-transparent border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold" 
              required 
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gold hover:bg-gold-dark text-white px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {/* Status Message */}
          {subscriptionStatus !== 'idle' && (
            <div className={`mt-4 p-3 rounded-lg flex items-center justify-center gap-2 ${
              subscriptionStatus === 'success' 
                ? 'bg-green-900/20 text-green-300 border border-green-700' 
                : 'bg-red-900/20 text-red-300 border border-red-700'
            }`}>
              {subscriptionStatus === 'success' ? (
                <CheckCircleIcon size={16} />
              ) : (
                <XCircleIcon size={16} />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h4 className="font-serif text-lg mb-4">WangarèLuxe</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/about" className="hover:text-gold">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-gold">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="hover:text-gold">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          {/* Help */}
          <div>
            <h4 className="font-serif text-lg mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/delivery" className="hover:text-gold">
                  Delivery & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-gold">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/store-locator" className="hover:text-gold">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/terms" className="hover:text-gold">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-gold">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-gold">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
          {/* Connect */}
          <div>
            <h4 className="font-serif text-lg mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              <a href="https://www.instagram.com/wangareluxe/" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                <InstagramIcon size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://www.tiktok.com/@wangare.luxe?lang=en" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="sr-only">TikTok</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                <FacebookIcon size={20} />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
            <div className="text-sm text-gray-300">
              <p className="mb-2">Mon-Fri: 9am - 6pm</p>
              <p className="mb-2">📲 0112113237</p>
              <p>💌 info@wangareluxe.com</p>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} WangarèLuxe. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <img src="https://i.imgur.com/SN2hUdK.png" alt="Payment methods" className="h-6" />
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;