import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = await params;

  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/deliver`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({}),
        credentials: 'include'
      }
    );

    // First check if the response is JSON
    const contentType = backendResponse.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await backendResponse.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
    }

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      throw new Error(result.error || result.message || 'Failed to update order status');
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Delivery error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Delivery update failed'
      },
      { status: 500 }
    );
  }
}