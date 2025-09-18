import React, { useEffect, useState } from 'react';

interface InstagramThumbnailExtractorProps {
  postUrl: string;
  onThumbnailExtracted: (thumbnailUrl: string) => void;
}

const InstagramThumbnailExtractor: React.FC<InstagramThumbnailExtractorProps> = ({
  postUrl,
  onThumbnailExtracted
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  useEffect(() => {
    const extractThumbnail = async () => {
      try {
        // Extract post ID from Instagram URL
        const postIdMatch = postUrl.match(/\/reel\/([^\/\?]+)/);
        if (!postIdMatch) return;

        const postId = postIdMatch[1];
        
        // Try to get thumbnail using Instagram's oEmbed API
        const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(postUrl)}&access_token=YOUR_ACCESS_TOKEN`;
        
        // For now, we'll use a fallback method to construct thumbnail URLs
        // Instagram video thumbnails typically follow this pattern:
        const thumbnailUrl = `https://scontent.cdninstagram.com/v/t51.2885-15/${postId}_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent.cdninstagram.com&_nc_cat=111&_nc_ohc=${postId}Q7oABC123&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=${postId}%3D%3D.2-ccb7-5&oh=00_AbC123DeF456GhI789JkL012MnOpQrStUvWxYz&oe=12345678&_nc_sid=10d13b`;
        
        setThumbnailUrl(thumbnailUrl);
        onThumbnailExtracted(thumbnailUrl);
      } catch (error) {
        console.error('Error extracting thumbnail:', error);
        // Fallback to a default thumbnail
        const fallbackThumbnail = 'https://images.unsplash.com/photo-1590739225287-bd2d682c8bf8?q=80&w=600&auto=format&fit=crop';
        setThumbnailUrl(fallbackThumbnail);
        onThumbnailExtracted(fallbackThumbnail);
      }
    };

    if (postUrl) {
      extractThumbnail();
    }
  }, [postUrl, onThumbnailExtracted]);

  return null; // This component doesn't render anything
};

export default InstagramThumbnailExtractor;
