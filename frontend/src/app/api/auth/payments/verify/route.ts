

import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    // Debugging: Log incoming request
    console.log('Payment verification request received');
    
    // Extract JWT from cookies
    const jwt = req.cookies.get("jwt")?.value;
    if (!jwt) {
      console.error('No JWT token found');
      return NextResponse.json(
        { error: "Not authorized, no token found" },
        { status: 401 }
      );
    }

    // Get reference and order_id from query params
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    const order_id = searchParams.get("order_id");

    console.log('Verification parameters:', { reference, order_id });

    if (!reference || !order_id) {
      console.error('Missing parameters:', { reference, order_id });
      return NextResponse.json(
        { error: "Reference and order ID are required" },
        { status: 400 }
      );
    }

    // Verify payment with backend
    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/verify-payment?reference=${reference}&order_id=${order_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        }
      }
    );

    // Debugging: Log backend response
    const backendResponse = await verifyResponse.json();
    console.log('Backend verification response:', backendResponse);

    if (!verifyResponse.ok) {
      console.error('Backend verification failed:', backendResponse);
      return NextResponse.json(
        { 
          error: backendResponse.error || "Payment verification failed",
          details: backendResponse.details
        },
        { status: verifyResponse.status }
      );
    }

    return NextResponse.json(backendResponse);
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Payment verification failed",
        success: false
      },
      { status: 500 }
    );
  }
}