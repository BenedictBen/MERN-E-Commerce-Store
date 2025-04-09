
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Get JWT token from cookies
    const jwt = req.cookies.get("jwt")?.value;
    
    if (!jwt) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Fetch orders from backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      cache: "no-store",
    });

    // 3. Handle non-OK responses
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || "Failed to fetch orders" 
        },
        { status: response.status }
      );
    }

    // 4. Get orders data (handles both array and { orders: [] } formats)
    const data = await response.json();
    const orders = Array.isArray(data) ? data : data?.orders || [];

    // 5. Return successful response
    return NextResponse.json({ 
      success: true,
      data: orders 
    });

  } catch (error) {
    // 6. Handle unexpected errors
    console.error("[ORDERS] GET Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}