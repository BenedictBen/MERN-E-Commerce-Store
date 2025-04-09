

import { NextRequest, NextResponse } from "next/server";
// Update your Next.js API route (app/api/auth/product/create/route.ts)
export async function POST(req: NextRequest) {
  const jwt = req.cookies.get("jwt")?.value;

  if (!jwt) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  } 

  try {
    const formData = await req.formData();
    
    // Add Content-Type header with boundary for form data
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
      },
      body: formData,
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      let errorMessage = data.error || data.message || "Failed to create product";
      
      if (data.details) {
        if (Array.isArray(data.details)) {
          errorMessage += `: ${data.details.join(", ")}`;
        } else if (typeof data.details === "string") {
          errorMessage += `: ${data.details}`;
        }
      }

      if (data.missingFields) {
        errorMessage += ` (Missing fields: ${data.missingFields.join(", ")})`;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: data.details,
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product: data.product,
        message: data.message || "Product created successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Product creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}