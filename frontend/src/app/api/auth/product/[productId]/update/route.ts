import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { productId: string } }) {
  const jwt = req.cookies.get("jwt")?.value;

  if (!jwt) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { productId } = await params;
    const formData = await req.formData();

    // Prepare product data
    const productData = new FormData();
    productData.append('name', formData.get('name') as string);
    productData.append('description', formData.get('description') as string || "");
    productData.append('price', parseFloat(formData.get('price') as string).toFixed(2));
    productData.append('category', formData.get('category') as string);
    productData.append('quantity', parseInt(formData.get('quantity') as string).toString());
    productData.append('brand', formData.get('brand') as string || "Unbranded");

    // Handle images
    const images = formData.getAll('images');
    images.forEach((img) => {
      if (img instanceof Blob) {
        productData.append('images', img);
      } else if (typeof img === 'string') {
        productData.append('existingImages', img); // Handle existing image URLs
      }
    });

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${jwt}`,
      },
      body: productData,
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `Backend responded with status ${backendResponse.status}`);
    }

    const result = await backendResponse.json();
    return NextResponse.json(
      { success: true, product: result },
      { status: 200 }
    );

  } catch (error) {
    console.error("[Product Update] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
