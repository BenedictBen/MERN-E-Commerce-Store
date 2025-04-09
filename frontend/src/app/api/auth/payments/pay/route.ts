

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Extract JWT from cookies
    const jwt = req.cookies.get("jwt")?.value;

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get order ID from request body
    const { orderId } = await req.json();
    
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Initialize payment with backend
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          callback_url: `${process.env.FRONTEND_URL}/checkout/order-received`,
          order: orderId,
          metadata: {
            order_id: orderId // Important: Include order ID in metadata
          }
        }),
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error("Payment initialization failed:", data.error);
      return NextResponse.json(
        { message: data.error || "Payment initialization failed" },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in payment initialization:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}