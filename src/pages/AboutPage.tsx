import React from 'react';
import { Link } from 'react-router-dom';
const AboutPage: React.FC = () => {
  return (
    <div className="bg-white w-full">
      {/* Hero Section */}
      <section className="relative h-96">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" alt="WangarèLuxe brand story" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative container-luxe h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">The WangarèLuxe Story</h1>
          <p className="text-lg max-w-xl">
            Born from resilience, crafted with purpose
          </p>
        </div>
      </section>
      {/* Brand Story */}
      <section className="py-16">
        <div className="container-luxe">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl mb-8 text-center">
              The WangarèLuxe Story
            </h2>
            <p className="text-gray-700 mb-6">
              Founded in 2025 by a Kenyan woman named Wangari Kairu, WangarèLuxe was born from more than just a love for design—it was born from resilience.
            </p>
            <p className="text-gray-700 mb-6">
              After walking through a deeply challenging season in my life, I turned to creativity as a way to heal, rebuild, and rediscover my sense of purpose. What began as sketches and small ideas slowly grew into a brand that celebrates not only timeless luxury but also the strength that comes from starting again.
            </p>
            <p className="text-gray-700 mb-6">
              WangarèLuxe is a fusion of African craftsmanship and global design influences. Out of pain came power, and out of that moment WangarèLuxe was born.
            </p>
            <p className="text-gray-700 mb-6">
              Every WangarèLuxe piece is carefully curated to reflect timeless style, quality craftsmanship, and the belief that women deserve to experience luxury in both the big and small details of their lives. It's not just about fashion or accessories—it's about a lifestyle where elegance meets intention.
            </p>
            <p className="text-gray-700 mb-6">
              WangarèLuxe stands as a reminder that luxury is not only about what we wear, but also about the journey, courage, and authenticity behind it. At WangarèLuxe, we celebrate women who rise, women who redefine themselves, and women who embrace the richness of who they are. Because true luxury is not just what you wear—it's how you live, and how you choose to show up for yourself every day.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3" alt="WangarèLuxe craftsmanship" className="w-full h-full object-cover" />
              <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3" alt="WangarèLuxe products" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-700 mb-6">
              At the heart of WangarèLuxe is a commitment to celebrating women's strength and resilience. We work closely with local artisans, providing fair wages and supporting traditional craftsmanship while creating pieces that empower women to embrace their authentic selves.
            </p>
            <p className="text-gray-700 mb-6">
              Today, WangarèLuxe stands as a testament to the power of transformation and the beauty that emerges from life's challenges. Our carefully curated collection reflects not just luxury, but the courage and authenticity that define the modern woman's journey.
            </p>
            <div className="border-l-4 border-gold pl-6 my-10">
              <p className="text-xl font-serif italic">
                "Out of pain came power, and out of that moment WangarèLuxe was born. 
                True luxury is not just what you wear—it's how you live, and how you 
                choose to show up for yourself every day."
              </p>
              <p className="mt-3 font-medium">— Wangari Kairu, Founder</p>
            </div>
          </div>
        </div>
      </section>
      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-luxe">
          <h2 className="font-serif text-3xl mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Resilience</h3>
              <p className="text-gray-600">
                We believe in the power of transformation and the strength that comes from starting again. Each WangarèLuxe piece is crafted with the understanding that true beauty emerges from life's challenges and the courage to rebuild.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Authenticity</h3>
              <p className="text-gray-600">
                We celebrate the authentic journey of every woman. Our pieces are designed to reflect not just style, but the courage to be true to oneself, embracing both the challenges and triumphs that shape our unique stories.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Empowerment</h3>
              <p className="text-gray-600">
                We believe in empowering women to rise, redefine themselves, and embrace their richness. Through our community of artisans and customers, we create spaces where women can celebrate their strength and support each other's journeys.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Team */}
      <section className="py-16">
        <div className="container-luxe">
          <h2 className="font-serif text-3xl mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            name: 'Wangari Kairu',
            title: 'Founder & Creative Director',
            image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.0.3'
          }, {
            name: 'David Omondi',
            title: 'Head of Design',
            image: '/head.jpeg'
          }, {
            name: 'Amina Hassan',
            title: 'Production Manager',
            image: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.0.3'
          }, {
            name: 'James Mwangi',
            title: 'Marketing Director',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3'
          }].map((member, index) => <div key={index} className="text-center">
                <div className="mb-4 overflow-hidden rounded-full">
                  <img src={member.image} alt={member.name} className="w-48 h-48 object-cover mx-auto" />
                </div>
                <h3 className="font-medium text-lg mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.title}</p>
              </div>)}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-luxe text-center">
          <h2 className="font-serif text-3xl mb-4">Experience WangarèLuxe</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our collection of meticulously crafted luxury goods and
            experience the elegance and quality that defines WangarèLuxe.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="btn btn-primary">
              Shop Collection
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Visit Our Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AboutPage;