import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const { productId  } = await params;

  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || 'Failed to fetch product');
    }

    const product = await backendResponse.json();

    // Transform image URLs before returning
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map((img: any) => ({
        ...img,
        url: getImageUrl(img.url || img)
      }));
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('[Product Fetch] Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        success: false
      },
      { status: 500 }
    );
  }
}

// Helper function to ensure proper image URL
const getImageUrl = (url: string) => {
  // 1. Handle empty/undefined URLs
  if (!url) return '/shop/vr000.webp';
  
  // 2. Return full URLs immediately
  if (url.startsWith('http')) return url;
  
  // 3. Normalize URL paths
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  // 4. Special handling for protected paths
  const protectedPaths = ['/uploads/', '/public/'];
  if (protectedPaths.some(path => normalizedUrl.startsWith(path))) {
    return `${baseUrl}${normalizedUrl}`;
  }
  
  // 5. Default return for non-protected paths
  return url;
};