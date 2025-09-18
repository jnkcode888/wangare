import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, CheckCircleIcon, XCircleIcon, XIcon } from 'lucide-react';
import { sendContactForm } from '../services/apiEmailService';
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await sendContactForm({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone: formData.phone
      });

      if (result.success) {
        setSubmitStatus('success');
        setShowModal(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        // Auto-close success modal after 5 seconds
        setTimeout(() => {
          setShowModal(false);
        }, 5000);
      } else {
        setSubmitStatus('error');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="bg-white w-full">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-luxe text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            We'd love to hear from you. Get in touch with our team for any
            inquiries, feedback, or assistance.
          </p>
        </div>
      </section>
      {/* Contact Information */}
      <section className="py-16">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl mb-6">Send Us a Message</h2>
              

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold" 
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5} 
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-gold" 
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            {/* Contact Details */}
            <div>
              <h2 className="font-serif text-2xl mb-6">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center">
                      <MapPinIcon size={20} className="text-gold" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Visit Our Store</h3>
                    <p className="text-gray-600 mb-1">
                      WangarèLuxe Flagship Store
                    </p>
                    <p className="text-gray-600 mb-1">123 Riverside Drive</p>
                    <p className="text-gray-600">Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center">
                      <PhoneIcon size={20} className="text-gold" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-1">
                      📲 0112113237
                    </p>
                    <p className="text-gray-600">
                      Available Mon-Fri: 9am - 6pm
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center">
                      <MailIcon size={20} className="text-gold" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-1">
                      💌 info@wangareluxe.com
                    </p>
                    <p className="text-gray-600">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center">
                      <ClockIcon size={20} className="text-gold" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Opening Hours</h3>
                    <p className="text-gray-600 mb-1">
                      Monday - Friday: 9:00 AM - 7:00 PM
                    </p>
                    <p className="text-gray-600 mb-1">
                      Saturday: 10:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600">Sunday: 12:00 PM - 5:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <h3 className="font-medium mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Map */}
      <section className="py-16 bg-gray-50">
        <div className="container-luxe">
          <h2 className="font-serif text-2xl mb-6 text-center">Find Us</h2>
          <div className="h-96 bg-gray-200">
            {/* In a real implementation, this would be a Google Maps embed */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Map would be embedded here</p>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="py-16">
        <div className="container-luxe">
          <h2 className="font-serif text-3xl mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[{
            question: 'What are your shipping options?',
            answer: 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days) throughout Kenya. International shipping is available to select countries with delivery times varying by location.'
          }, {
            question: 'What is your return policy?',
            answer: 'We accept returns within 14 days of purchase for items in their original condition with tags attached. Custom orders and sale items are final sale. Please visit our Delivery & Returns page for more information.'
          }, {
            question: 'Do you offer gift wrapping?',
            answer: 'Yes, we offer complimentary gift wrapping for all purchases. You can select this option during checkout and include a personalized message for the recipient.'
          }, {
            question: 'Can I schedule a private shopping appointment?',
            answer: 'Absolutely! We offer private shopping appointments at our flagship store. Please contact us at info@wangareluxe.com or call 0112113237 to schedule your visit.'
          }].map((faq, index) => <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="font-medium text-lg mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Feedback Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>

              {/* Success Modal */}
              {submitStatus === 'success' && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Thank you for contacting WangarèLuxe. We've received your message and will get back to you within 24 hours.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-green-800">
                      <strong>What happens next?</strong>
                    </p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• We'll review your message</li>
                      <li>• Our team will respond via email</li>
                      <li>• We'll address your inquiry promptly</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Error Modal */}
              {submitStatus === 'error' && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <XCircleIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Failed to Send Message
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    We're sorry, but there was an error sending your message. Please try again or contact us directly.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-red-800">
                      <strong>Alternative ways to reach us:</strong>
                    </p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      <li>• Email: info@wangareluxe.com</li>
                      <li>• Phone: 0112113237</li>
                      <li>• Visit our store in Nairobi</li>
                    </ul>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSubmitStatus('idle');
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>;
};
export default ContactPage;