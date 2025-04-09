import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, context: { params: { productId: string } }) {
  try {
    // Await the params to avoid the "sync-dynamic-apis" error
    const { productId } = await context.params;

    if (!productId) {
      console.error("Product ID is missing");
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    console.log("Product ID from params:", productId); // ✅ Log product ID

    // Extract the token from cookies using Next.js built-in method
    const jwt = req.cookies.get("jwt")?.value;

    if (!jwt) {
      console.error("No token found in cookies.");
      return NextResponse.json({ message: "Not authorized, no token." }, { status: 401 });
    }

    console.log("Token from cookies:", jwt); // ✅ Verify the token

    // Get the body data from the request
    const { rating, comment } = await req.json();
    console.log("Received rating:", rating, "Received comment:", comment); // ✅ Log input data

    if (!rating || !comment) {
      console.error("Rating or comment is missing");
      return NextResponse.json({ message: "Rating and comment are required" }, { status: 400 });
    }

    // Make the backend API request
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/reviews`;
    console.log("Making request to backend URL:", backendUrl); // ✅ Log the backend URL

    try {
      const backendResponse = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${jwt}`, // Add the token to the Authorization header
        },
        body: JSON.stringify({ rating, comment }),
      });

      console.log("Backend response status:", backendResponse.status); // ✅ Log backend response status

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error("Backend API error:", errorData); // ✅ Log backend error message
        return NextResponse.json({ message: errorData.message || "Backend API error" }, { status: backendResponse.status });
      }

      const responseData = await backendResponse.json();
      console.log("Backend response data:", responseData); // ✅ Log response data
      return NextResponse.json(responseData, { status: 200 });

    } catch (backendError) {
      console.error("Error making backend API request:", backendError);
      return NextResponse.json({ message: "Backend request failed" }, { status: 500 });
    }

  } catch (error) {
    console.error("Unexpected error in API route:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
