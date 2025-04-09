import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    // 1. Get JWT token from cookies
    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const { orderId, billingEmail } = await request.json()

    if (!orderId || !billingEmail) {
      return NextResponse.json(
        { error: 'Order ID and billing email are required' },
        { status: 400 }
      )
    }

    // 3. Forward request to backend with JWT
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({ orderId, billingEmail })
    })

    // 4. Handle backend response
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch tracking details' },
        { status: backendResponse.status }
      )
    }

    const trackingData = await backendResponse.json()
    return NextResponse.json(trackingData)

  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}