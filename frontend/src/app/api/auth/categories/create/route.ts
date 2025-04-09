import { NextRequest, NextResponse } from "next/server";

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
    
    // Extract data from FormData
    const main = formData.get('main')?.toString() || '';
    const sub = formData.get('sub')?.toString() || '';
    const tags = formData.get('tags')?.toString().split(',').map(tag => tag.trim()).filter(tag => tag) || [];

    // Validate required fields
    if (!main || !sub) {
      return NextResponse.json(
        { success: false, error: "Both main and sub category fields are required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({ main, sub, tags }),
    });

    // Check response content type
    const contentType = backendResponse.headers.get("content-type");
    let data: any;

    if (contentType?.includes("application/json")) {
      data = await backendResponse.json();
    } else {
      const text = await backendResponse.text();
      throw new Error(`Backend returned non-JSON response: ${text}`);
    }

    if (!backendResponse.ok) {
      const errorMessage = data.error || data.message || "Failed to create category";
      throw new Error(errorMessage);
    }

    return NextResponse.json(
      {
        success: true,
        category: data,
        message: "Category created successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Category creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}