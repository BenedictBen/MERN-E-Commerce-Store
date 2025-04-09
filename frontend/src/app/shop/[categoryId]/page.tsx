
import ShopHero from "@/components/ShopHero";
import Shopping from "@/components/Shopping";
import { transformFlashDealData } from "@/lib/types";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ 
  params 
}: { 
  params: { categoryId?: string } 
}) {
  try {
     // Await params to resolve async route parameter issue
     const { categoryId } = await params;  // 🆗 Await the params here

     const decodedCategoryId = categoryId ? decodeURIComponent(categoryId) : undefined;
     
     const cookieStore = await cookies(); // 🆗 Use await here
 
    const jwt = cookieStore.get('jwt')?.value;

    if (!jwt) {
      throw new Error('Authentication required');
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    
    // For category page, we need to fetch both category details and its products
    const [categoryRes, categoriesRes] = await Promise.all([
      categoryId 
        ? fetch(`${API_BASE}/api/category/${decodedCategoryId}`, {
            headers: { 
              "Authorization": `Bearer ${jwt}`,
              "Content-Type": "application/json"
            },
            cache: "no-store",
          })
        : Promise.resolve({ ok: true, json: () => ({ products: [] }) }),
      
      fetch(`${API_BASE}/api/category/categories`, {
        headers: { 
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json"
        },
        cache: "no-store",
      })
    ]);

    if (!categoriesRes.ok || (categoryId && !categoryRes.ok)) {
      throw new Error('Failed to fetch data');
    }

    const categoriesData = await categoriesRes.json();
    console.log('Raw categories data:', JSON.stringify(categoriesData, null, 2)); // Detailed log
    
    // Transform the API response into the format your frontend expects
    const categories = Array.isArray(categoriesData) 
  ? categoriesData.map(category => ({
      _id: category._id,
      main: category.main || 'Uncategorized',
      sub: '' // Explicit empty subcategory
    }))
  : [];

console.log('Transformed categories:', JSON.stringify(categories, null, 2));

// Add this debug log before returning
console.log('Props being passed to Shopping:', {
 
  initialCategories: categories.length,
  initialCategoryId: categoryId
});

    let products = [];
    if (categoryId) {
      const categoryData = await categoryRes.json();
      const rawProducts = Array.isArray(categoryData.products) 
        ? categoryData.products 
        : [];
    
      products = rawProducts.map((product: any) => {
        // Ensure complete category data
        const productCategory = product.category || {
          _id: categoryData.category?._id || categoryId,
          main: categoryData.category?.main || 'Uncategorized',
          sub: categoryData.category?.sub || ''
        };
    
        // Ensure complete product details
        const productDetails = product.details || {};
        if (!productDetails.manufacturer) {
          productDetails.manufacturer = {
            name: product.brand || product.details.manufacturer || "Unknown Manufacturer"
          };
        }
    
        // Ensure complete ratings
        const productRatings = product.ratings || { 
          average: 0, 
          count: 0,
          distribution: {
            "5": 0,
            "4": 0,
            "3": 0,
            "2": 0,
            "1": 0
          }
        };
    
        return {
          ...transformFlashDealData({
            ...product,
            category: productCategory,
            details: productDetails,
            ratings: productRatings
          }),
          _id: product._id,
          category: productCategory,
          details: productDetails,
          variants: product.variants || {},
          ratings: productRatings
        };
      });
    } else {
      // For all products page
      const productsRes = await fetch(`${API_BASE}/api/product/allproducts`, {
        headers: { 
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json"
        },
        cache: "no-store",
      });
      
      if (!productsRes.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const productsData = await productsRes.json();
      products = Array.isArray(productsData) 
        ? productsData.map(transformFlashDealData)
        : productsData.products?.map(transformFlashDealData) || [];
    }

    return (
      <div>
        <ShopHero category={
      categoryId 
        ? categories.find(c => c._id === categoryId)?.main || "Shop" 
        : "Shop"
    }  />
        <Shopping 
        initialProducts={products}
        initialCategories={categories}
        initialCategoryId={categoryId}
      />
      </div>
    );

  } catch (error) {
    console.error("Error in CategoryPage:", error);
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Error loading products</h3>
        <p className="text-gray-600 mt-2">
          {error instanceof Error ? error.message : "Please try again later"}
        </p>
      </div>
    );
  }
}