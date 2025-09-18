import React from 'react';
import { PlayIcon, ExternalLinkIcon } from 'lucide-react';

interface TikTokVideoCardProps {
  videoUrl: string;
  title: string;
  playCount: number;
  onVideoClick: (url: string) => void;
  thumbnailImage?: string;
}

const TikTokVideoCard: React.FC<TikTokVideoCardProps> = ({
  videoUrl,
  title,
  playCount,
  onVideoClick,
  thumbnailImage
}) => {
  return (
    <div 
      className="group relative aspect-[9/16] overflow-hidden rounded-lg cursor-pointer bg-gray-100"
      onClick={() => onVideoClick(videoUrl)}
    >
      {/* Thumbnail Image */}
      <div className="w-full h-full relative">
        <img 
          src={thumbnailImage || '/eleven.png'} 
          alt="TikTok video thumbnail" 
          className="w-full h-full object-cover"
        />
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
            <PlayIcon className="h-8 w-8 text-gray-800" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* TikTok Badge */}
      <div className="absolute top-2 right-2 rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white font-medium">
        TIKTOK
          </div>

      {/* External Link Icon */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="rounded-full bg-white bg-opacity-90 p-1.5 shadow-md">
              <ExternalLinkIcon className="h-3 w-3 text-gray-700" />
          </div>
        </div>

      {/* Title and Stats Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-xs line-clamp-2 leading-tight mb-2">
            {title}
          </p>
          
          <div className="flex items-center justify-between text-white/80 text-xs">
            <span>{playCount.toLocaleString()} views</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs">#wangarèluxe</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default TikTokVideoCard;
