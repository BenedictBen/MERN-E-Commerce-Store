// utils/imageUtils.ts
export const getProductImage = (url: string | undefined) => {
  if (!url) return '/shop/vr000.webp';
  
  // Already a full URL (Cloudinary or other external)
  if (url.startsWith('http') || url.startsWith('https')) return url;
  
  // Handle local development paths
  if (process.env.NODE_ENV === 'development') {
    if (url.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    if (url.startsWith('public/')) return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
  }
  
  // Handle production paths
  if (url.startsWith('/uploads/') || url.startsWith('/public/')) {
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${url}`;
  }
  
  // Default case - assume it's a relative path from public folder
  return url;
};



// utils/imageUtils.ts
export const getProductImageUrl = (url: string | undefined) => {
  if (!url) return '/shop/vr000.webp';
  
  // Already a full URL (Cloudinary or other external)
  if (url.startsWith('http') || url.startsWith('https')) {
    // For Cloudinary URLs, you might want to add optimization parameters
    if (url.includes('res.cloudinary.com')) {
      return url.replace('/upload/', '/upload/q_auto,f_auto/');
    }
    return url;
  }
  
  // Handle local development paths
  if (process.env.NODE_ENV === 'development') {
    if (url.startsWith('/uploads/')) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    if (url.startsWith('public/')) return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
  }
  
  // Handle production paths
  if (url.startsWith('/uploads/') || url.startsWith('/public/')) {
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${url}`;
  }
  
  // Default case - assume it's a relative path from public folder
  return url;
};