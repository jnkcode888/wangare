import React, { useEffect, useState } from 'react';
import { PlayIcon, ExternalLinkIcon } from 'lucide-react';
import EmbeddedTikTokVideo from './EmbeddedTikTokVideo';
import TikTokVideoCard from './TikTokVideoCard';

// Real TikTok videos from WangarèLuxe account
const realTikTokVideos = [
  {
    id: '1',
    title: 'I\'m officially a business owner. It\'s terrifying. It\'s overwhelming...',
    play_count: 2000,
    share_url: 'https://www.tiktok.com/@wangare.luxe/video/7517716142501219589',
    duration: 60,
    thumbnail: '/eleven.png'
  },
  {
    id: '2',
    title: 'Check next video for available bags and ps there\'s one piece of each bag...',
    play_count: 1500,
    share_url: 'https://www.tiktok.com/@wangare.luxe/video/7530920411328990520',
    duration: 30,
    thumbnail: '/twelve.png'
  },
  {
    id: '3',
    title: 'The red fur one is my favorite. Tell us your favorite bag in the comment section...',
    play_count: 1200,
    share_url: 'https://www.tiktok.com/@wangare.luxe/video/7518836731785858310',
    duration: 25,
    thumbnail: '/thirteen.png'
  },
  {
    id: '4',
    title: 'GUYS… WE\'RE AT 2,000 IN LESS THAN 12 HOURS?? Oh my God. I\'m shaking...',
    play_count: 5000,
    share_url: 'https://www.tiktok.com/@wangare.luxe/video/7518014415636008248',
    duration: 90,
    thumbnail: '/fourteen.png'
  }
];

interface TikTokFeedProps {
  maxVideos?: number;
  showStats?: boolean;
}

const TikTokFeed: React.FC<TikTokFeedProps> = ({ 
  maxVideos = 4, 
  showStats = true 
}) => {
  const [videos, setVideos] = useState(realTikTokVideos);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // In production, replace this with actual TikTok API
  useEffect(() => {
    // fetchTikTokVideos();
  }, []);

  const handleVideoClick = (e: React.MouseEvent, videoUrl: string) => {
    e.preventDefault();
    setSelectedVideo(videoUrl);
  };

  const closeEmbeddedVideo = () => {
    setSelectedVideo(null);
  };

  const displayVideos = videos.slice(0, maxVideos);

  const formatPlayCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading TikTok videos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayVideos.map((video) => (
              <TikTokVideoCard
                key={video.id}
                videoUrl={video.share_url}
                title={video.title}
                playCount={video.play_count}
                thumbnailImage={video.thumbnail}
                onVideoClick={(url) => setSelectedVideo(url)}
              />
            ))}
          </div>

          {/* Embedded Video Modal */}
          <EmbeddedTikTokVideo
            videoUrl={selectedVideo || ''}
            onClose={closeEmbeddedVideo}
            isOpen={!!selectedVideo}
          />
        </>
      )}
    </div>
  );
};

// Extend Window interface for TikTok embed
declare global {
  interface Window {
    tiktokEmbed?: {
      lib: {
        render: () => void;
      };
    };
  }
}

export default TikTokFeed;