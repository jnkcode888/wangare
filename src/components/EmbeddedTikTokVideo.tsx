import React, { useState } from 'react';
import { XIcon, ExternalLinkIcon } from 'lucide-react';

interface EmbeddedTikTokVideoProps {
  videoUrl: string;
  onClose: () => void;
  isOpen: boolean;
}

const EmbeddedTikTokVideo: React.FC<EmbeddedTikTokVideoProps> = ({
  videoUrl,
  onClose,
  isOpen
}) => {
  const [loading, setLoading] = useState(true);

  // Extract video ID from TikTok URL
  const getVideoId = (url: string) => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  // Generate direct TikTok embed URL
  const getEmbedUrl = (url: string) => {
    const videoId = getVideoId(url);
    if (!videoId) return '';
    
    // Direct embed URL format
    return `https://www.tiktok.com/embed/v2/${videoId}`;
  };

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
  };

  if (!isOpen) return null;

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium text-gray-900">TikTok Video</h3>
          <div className="flex items-center gap-2">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Open in TikTok"
            >
              <ExternalLinkIcon size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative overflow-auto max-h-[calc(90vh-80px)]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                <p className="text-gray-500">Loading TikTok video...</p>
              </div>
            </div>
          )}
          
          {embedUrl && (
            <div className="aspect-[9/16] w-full">
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                onLoad={handleIframeLoad}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmbeddedTikTokVideo;
