import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    if (!jwt) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Authentication token missing" 
        },
        { status: 401 }
      );
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/allproducts`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      cache: "no-store", // Bypass cache for fresh data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Failed to fetch products (Status: ${response.status})`
      );
    }

    const data = await response.json();
   
    // Ensure consistent response format
    return NextResponse.json({
      success: true,
      products: Array.isArray(data) ? data : data.products || []
    });

  } catch (error) {
    console.error("[PRODUCTS_API_ERROR]:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}