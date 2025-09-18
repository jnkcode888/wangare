import React, { useEffect, useRef, useState } from 'react';
import { XIcon, ExternalLinkIcon } from 'lucide-react';

interface EmbeddedInstagramPostProps {
  postUrl: string;
  onClose: () => void;
  isOpen: boolean;
}

const EmbeddedInstagramPost: React.FC<EmbeddedInstagramPostProps> = ({
  postUrl,
  onClose,
  isOpen
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  // Convert Instagram post URL to embed URL
  const getEmbedUrl = (url: string) => {
    // Extract post ID from URL (e.g., https://instagram.com/p/ABC123/)
    const postId = url.match(/\/p\/([^\/]+)/)?.[1];
    if (postId) {
      return `https://www.instagram.com/p/${postId}/embed/`;
    }
    return url + 'embed/';
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Load Instagram embed script
      if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [isOpen]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium text-gray-900">Instagram Post</h3>
          <div className="flex items-center gap-2">
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Open in Instagram"
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
        <div className="relative">
          {loading && (
            <div className="flex items-center justify-center h-96 bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading Instagram post...</p>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={getEmbedUrl(postUrl)}
            width="100%"
            height="500"
            frameBorder="0"
            scrolling="no"
            allowTransparency
            onLoad={handleIframeLoad}
            className={loading ? 'hidden' : 'block'}
          />
        </div>
      </div>
    </div>
  );
};

export default EmbeddedInstagramPost;
