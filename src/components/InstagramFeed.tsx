import React, { useEffect, useState } from 'react';
import { ExternalLinkIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import DirectInstagramEmbed from './DirectInstagramEmbed';
import InstagramVideoCard from './InstagramVideoCard';

// Real Instagram posts from WangarèLuxe account - videos will be embedded directly
const realInstagramPosts = [
  {
    id: '1',
    caption: 'WangarèLuxe luxury collection ✨ #LuxuryBags #WangarèLuxe',
    permalink: 'https://www.instagram.com/reel/DN_DctQjDBG/',
    timestamp: '2024-01-15T10:00:00Z',
    media_type: 'VIDEO',
    thumbnail: '/one.png'
  },
  {
    id: '2',
    caption: 'Luxury lifestyle moments 🌅 #Luxury #WangarèLuxe',
    permalink: 'https://www.instagram.com/reel/DN-zHSpjDyl/',
    timestamp: '2024-01-14T15:30:00Z',
    media_type: 'VIDEO',
    thumbnail: '/two.png'
  },
  {
    id: '3',
    caption: 'Handcrafted elegance 💎 #Jewelry #Handmade #WangarèLuxe',
    permalink: 'https://www.instagram.com/reel/DN-ncPMjF6X/',
    timestamp: '2024-01-13T12:15:00Z',
    media_type: 'VIDEO',
    thumbnail: '/three.png'
  },
  {
    id: '4',
    caption: 'Luxury lifestyle essentials 😴 #Luxury #WangarèLuxe',
    permalink: 'https://www.instagram.com/reel/DN8Ib6ajNn_/',
    timestamp: '2024-01-12T09:45:00Z',
    media_type: 'VIDEO',
    thumbnail: '/four.png'
  },
  {
    id: '5',
    caption: 'Elegant accessories collection ☀️ #Accessories #Style #WangarèLuxe',
    permalink: 'https://www.instagram.com/reel/DN6S0FjjJyT/',
    timestamp: '2024-01-11T14:20:00Z',
    media_type: 'VIDEO',
    thumbnail: '/five.png'
  },
  {
    id: '6',
    caption: 'Behind the scenes at WangarèLuxe 👰 #BehindTheScenes #WangarèLuxe',
    permalink: 'https://www.instagram.com/reel/DN_DctQjDBG/',
    timestamp: '2024-01-10T11:00:00Z',
    media_type: 'VIDEO',
    thumbnail: '/six.png'
  }
];

interface InstagramFeedProps {
  maxPosts?: number;
  showCaptions?: boolean;
  gridCols?: number;
}

const InstagramFeed: React.FC<InstagramFeedProps> = ({ 
  maxPosts = 6, 
  showCaptions = false,
  gridCols = 6 
}) => {
  const [posts, setPosts] = useState(realInstagramPosts);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // In production, replace this with actual Instagram Basic Display API
  useEffect(() => {
    // fetchInstagramPosts();
  }, []);

  const displayPosts = posts.slice(0, maxPosts);
  const postsPerView = 4;
  const totalSlides = Math.ceil(displayPosts.length / postsPerView);

  const handlePostClick = (e: React.MouseEvent, permalink: string) => {
    e.preventDefault();
    setSelectedPost(permalink);
  };

  const closeEmbeddedPost = () => {
    setSelectedPost(null);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const getCurrentPosts = () => {
    const startIndex = currentIndex * postsPerView;
    return displayPosts.slice(startIndex, startIndex + postsPerView);
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading Instagram posts...</p>
        </div>
      ) : (
        <>
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-transform duration-300 ease-in-out ${
                  isTransitioning ? 'opacity-50' : 'opacity-100'
                }`}
              >
                {getCurrentPosts().map((post) => (
                  <InstagramVideoCard
                    key={post.id}
                    postUrl={post.permalink}
                    caption={post.caption}
                    thumbnailImage={post.thumbnail}
                    onVideoClick={(url) => setSelectedPost(url)}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  disabled={isTransitioning}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                  aria-label="Previous videos"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                </button>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  disabled={isTransitioning}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                  aria-label="Next videos"
                >
                  <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentIndex(index);
                        setTimeout(() => setIsTransitioning(false), 300);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? 'bg-gray-800 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Embedded Post Modal */}
          <DirectInstagramEmbed
            postUrl={selectedPost || ''}
            onClose={closeEmbeddedPost}
            isOpen={!!selectedPost}
          />
        </>
      )}
    </div>
  );
};

export default InstagramFeed;