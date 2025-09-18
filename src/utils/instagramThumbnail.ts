// Utility to get Instagram video thumbnails
export const getInstagramThumbnail = (postUrl: string): string => {
  // Extract post ID from Instagram URL
  const postIdMatch = postUrl.match(/\/reel\/([^\/\?]+)/);
  if (!postIdMatch) {
    return 'https://images.unsplash.com/photo-1590739225287-bd2d682c8bf8?q=80&w=600&auto=format&fit=crop';
  }

  const postId = postIdMatch[1];
  
  // Video-like thumbnails that look more like Instagram reels
  const videoThumbnails = [
    // Luxury bags and accessories
    'https://images.unsplash.com/photo-1590739225287-bd2d682c8bf8?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    // Perfume and beauty
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    // Jewelry and elegance
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    // Lifestyle and home
    'https://images.unsplash.com/photo-1629949009765-718383f03516?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    // Sunglasses and accessories
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    // Bridal and special occasions
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  ];
  
  // Use post ID to determine which thumbnail to use (for consistency)
  const index = postId.charCodeAt(0) % videoThumbnails.length;
  return videoThumbnails[index];
};

// Alternative: Use a service to get real Instagram thumbnails
export const getRealInstagramThumbnail = async (postUrl: string): Promise<string> => {
  try {
    // This would require a backend service or API key
    // For now, return the placeholder
    return getInstagramThumbnail(postUrl);
  } catch (error) {
    console.error('Error fetching Instagram thumbnail:', error);
    return getInstagramThumbnail(postUrl);
  }
};
