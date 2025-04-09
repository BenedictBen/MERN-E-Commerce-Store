import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const jwt = req.cookies.get("jwt")?.value;

  if (!jwt) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { categoryId } = await params;
    const body = await req.json();

    if (!body.main || !body.subs || body.subs.length === 0) {
      return NextResponse.json(
        { success: false, error: "Main category and at least one subcategory are required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        main: body.main,
        subs: body.subs.map((sub: any) => ({
          sub: sub.sub,
          tags: sub.tags || []
        }))
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Failed to update category`);
    }

    const result = await backendResponse.json();
    return NextResponse.json({
      success: true,
      category: {
        _id: result._id || categoryId,
        main: result.main || body.main,
        subs: result.subs || body.subs
      }
    }, { status: 200 });

  } catch (error) {
    console.error("[Category Update] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}