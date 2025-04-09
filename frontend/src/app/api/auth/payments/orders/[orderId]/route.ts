import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params

  try {
    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch order')
    }

    const order = await response.json()
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 })
  }
}