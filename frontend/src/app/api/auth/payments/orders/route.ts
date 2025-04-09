import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    // Extract the token from cookies

        const cookieStore = await cookies()
        const jwt = cookieStore.get('jwt')?.value

    if (!jwt) {
      console.error("No token found in cookies.");
      return NextResponse.json(
        { message: "Not authorized, no token." }, 
        { status: 401 }
      );
    }

    console.log("Token from cookies:", jwt); // Debug log

    // Get the order data from the request
    const { orderItems, shippingAddress, paymentMethod } = await req.json();
    console.log("Received order data:", { orderItems, shippingAddress, paymentMethod });

    // Validate required fields
    if (!orderItems || !shippingAddress || !paymentMethod) {
      console.error("Missing required order fields");
      return NextResponse.json(
        { message: "Order items, shipping address, and payment method are required" },
        { status: 400 }
      );
    }

    // Make the backend API request
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders`;
    console.log("Making request to backend URL:", backendUrl);

    try {
      const backendResponse = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod
        }),
      });

      console.log("Backend response status:", backendResponse.status);

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error("Backend API error:", errorData);
        return NextResponse.json(
          { message: errorData.message || "Backend API error" },
          { status: backendResponse.status }
        );
      }

      const responseData = await backendResponse.json();
      console.log("Backend response data:", responseData);
      return NextResponse.json(responseData, { status: 200 });

    } catch (backendError) {
      console.error("Error making backend API request:", backendError);
      return NextResponse.json(
        { message: "Backend request failed" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Unexpected error in API route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}