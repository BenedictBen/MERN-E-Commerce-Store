// app/api/auth/categories/[categoryId]/products/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  if (!jwt) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { categoryId } = await params;

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}/products`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      throw new Error(error.message || 'Failed to fetch category products');
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}