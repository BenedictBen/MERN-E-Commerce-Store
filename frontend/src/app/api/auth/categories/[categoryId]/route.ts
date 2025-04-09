import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const jwt = req.cookies.get("jwt")?.value;

  if (!jwt) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { categoryId } = params;
      // Debug log to verify categoryId
      console.log("Fetching category ID:", categoryId);

    // Fetch category details (and products if backend supports it)
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch category ${categoryId}`);
    }

    const categoryData = await backendResponse.json();
    return NextResponse.json({ success: true, category: categoryData });
  } catch (error) {
    console.error("[Category Fetch] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}


