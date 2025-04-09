

import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    categoryId: string;
  };
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  const jwt = req.cookies.get("jwt")?.value;

  if (!jwt) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {

    const { categoryId } = await params;

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(
        errorData.error || errorData.message || `Failed to delete category`
      );
    }

    const result = await backendResponse.json().catch(() => ({}));
    
    return NextResponse.json(
      { 
        success: true,
        message: "Category deleted successfully",
        deletedCategory: result._id ? result : null
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Category Delete] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}