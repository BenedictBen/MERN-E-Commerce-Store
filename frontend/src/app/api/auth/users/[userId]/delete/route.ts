// app/api/auth/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  const jwt = req.cookies.get("jwt")?.value;

  if (!jwt) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { userId } = await params;

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });

    // First check if the response is JSON
    const contentType = backendResponse.headers.get("content-type");
    let responseData = {};
    
    if (contentType?.includes("application/json")) {
      responseData = await backendResponse.json().catch(() => ({}));
    }

    if (!backendResponse.ok) {
      const errorMessage = typeof responseData === 'object' && responseData !== null 
        ? (responseData as any).message || "Failed to delete user"
        : "Failed to delete user";
      
      throw new Error(errorMessage);
    }

    return NextResponse.json(
      { 
        success: true,
        message: "User deleted successfully",
        deletedUserId: userId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[User Delete] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}