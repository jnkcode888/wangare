import React, { useState } from 'react';
import { InstagramIcon, PlayIcon } from 'lucide-react';
import InstagramFeed from './InstagramFeed';
import TikTokFeed from './TikTokFeed';

// Custom TikTok Icon component
const TikTokIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className = "" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface SocialMediaSectionProps {
  showTikTok?: boolean;
  instagramHandle?: string;
  tiktokHandle?: string;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  showTikTok = true,
  instagramHandle = "wangareluxe",
  tiktokHandle = "wangareluxe"
}) => {
  const [activeTab, setActiveTab] = useState<'instagram' | 'tiktok'>('instagram');

  return (
    <section className="py-16">
      <div className="container-luxe text-center">
        <h2 className="font-serif text-3xl mb-4">Follow Our Journey</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community and share your WangarèLuxe moments with us on social media.
        </p>

        {/* Social Media Tabs */}
        {showTikTok && (
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActiveTab('instagram')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'instagram'
                    ? 'bg-white shadow-sm text-pink-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <InstagramIcon size={20} />
                <span className="font-medium">Instagram</span>
              </button>
              <button
                onClick={() => setActiveTab('tiktok')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'tiktok'
                    ? 'bg-white shadow-sm text-black'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <TikTokIcon size={20} />
                <span className="font-medium">TikTok</span>
              </button>
            </div>
          </div>
        )}

        {/* Social Media Content */}
        {activeTab === 'instagram' && (
          <div>
            <div className="mb-6">
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                <InstagramIcon size={20} />
                @{instagramHandle}
              </a>
            </div>
            <InstagramFeed maxPosts={6} gridCols={6} />
          </div>
        )}

        {activeTab === 'tiktok' && showTikTok && (
          <div>
            <div className="mb-6">
              <a
                href={`https://tiktok.com/@${tiktokHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-black hover:text-gray-800 font-medium"
              >
                <TikTokIcon size={20} />
                @{tiktokHandle}
              </a>
            </div>
            <TikTokFeed maxVideos={4} showStats={true} />
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Tag us in your posts for a chance to be featured!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-gold-light text-gold px-3 py-1 rounded-full text-sm font-medium">
              #WangarèLuxe
            </span>
            <span className="bg-gold-light text-gold px-3 py-1 rounded-full text-sm font-medium">
              #LuxuryLifestyle
            </span>
            <span className="bg-gold-light text-gold px-3 py-1 rounded-full text-sm font-medium">
              #AfricanLuxury
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
