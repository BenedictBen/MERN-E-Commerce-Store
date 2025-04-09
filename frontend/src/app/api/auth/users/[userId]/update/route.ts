// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  const jwt = req.cookies.get("jwt")?.value;

  if (!jwt) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { userId } = await params;
    const body = await req.json();

    // Basic validation
    if (!body.username || !body.email || typeof body.isAdmin !== 'boolean') {
      return NextResponse.json(
        { success: false, error: "Username, email and admin status are required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        isAdmin: body.isAdmin
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update user");
    }

    const result = await backendResponse.json();
    return NextResponse.json({
      success: true,
      user: result
    }, { status: 200 });

  } catch (error) {
    console.error("[User Update] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}