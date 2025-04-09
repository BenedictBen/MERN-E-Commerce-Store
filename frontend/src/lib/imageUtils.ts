// utils/imageUtils.ts
export const getProductImageUrl = (url: string | undefined) => {
  // Primary fallback
  if (!url) return '/shop/vr000.webp';
  
  // Handle different URL types
  if (url.startsWith('data:image')) {
    return '/shop/vr000.webp'; // Replace base64 placeholders
  }
  
  if (url.includes('res.cloudinary.com')) {
    // Ensure proper Cloudinary URL format
    return url.replace(
      /\/upload\/v\d+\//, 
      '/upload/c_limit,w_800,h_800,q_auto,f_auto/'
    );
  }
  
  // Local development handling
  if (process.env.NODE_ENV === 'development') {
    if (url.startsWith('/uploads/')) {
      return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    }
    if (url.startsWith('/')) {
      return url;
    }
  }
  
  // Production handling for local paths
  if (url.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://${process.env.NEXT_PUBLIC_API_URL}'}${url}`;
  }
  
  // Final fallback
  return '/shop/vr000.webp';
};