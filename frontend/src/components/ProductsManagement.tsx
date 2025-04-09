"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreateProductFormData,
  Product,
  ProductListResponse,
} from "@/lib/product";
import ProductForm from "./ProductForm";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";
import EditProductModal from "./EditProductModal";
import { Spinner } from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";
import { getProductImageUrl } from "@/lib/imageUtils";
import { toast } from "react-toastify";

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/auth/product", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to fetch products (Status: ${response.status})`
          );
        }

        const data: ProductListResponse = await response.json();
        console.log(data);
        // Handle both possible response structures
        const productsArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : [];

        if (productsArray.length === 0) {
          console.warn("Received empty products array from API");
        }

        setProducts(productsArray);
      } catch (err) {
        console.error("Fetch products error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
        setProducts([]); // Ensure products is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async (formData: FormData) => {
    if (!currentProduct) {
      toast.error("No product selected for editing");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      const requiredFields = [
        "name",
        "price",
        "category",
        "quantity",
        "description",
        "brand",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData.get(field)
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Convert and validate numeric fields
      const price = parseFloat(formData.get("price") as string);
      const quantity = parseInt(formData.get("quantity") as string);

      if (isNaN(price) || price < 0) {
        throw new Error("Price must be a positive number");
      }

      if (isNaN(quantity) || quantity < 0) {
        throw new Error("Quantity must be a positive integer");
      }

      // Prepare FormData with proper values
      const payload = new FormData();

      // Append basic product info
      payload.append("name", formData.get("name") as string);
      payload.append(
        "description",
        (formData.get("description") as string) || ""
      );
      payload.append("price", price.toFixed(2));
      payload.append("category", formData.get("category") as string);
      payload.append("quantity", quantity.toString());
      payload.append("brand", (formData.get("brand") as string) || "Unbranded");

      // Handle images in a more robust way
      const existingImages = formData.getAll("existingImages");
      const deletedImages = formData.getAll("deletedImages");
      const imageFiles = formData.getAll("images") as File[];

      // Validate and process images
      if (existingImages.length === 0 && imageFiles.length === 0) {
        throw new Error("At least one image is required");
      }

      // Process existing images (ensure they're strings)
      existingImages.forEach((img) => {
        if (typeof img === "string" && img.trim() !== "") {
          payload.append("existingImages", img);
        }
      });

      // Process deleted images
      deletedImages.forEach((img) => {
        if (typeof img === "string" && img.trim() !== "") {
          payload.append("deletedImages", img);
        }
      });

      // Process new image uploads
      imageFiles.forEach((file) => {
        if (file instanceof File) {
          // Validate file type
          const validTypes = ["image/jpeg", "image/png", "image/webp"];
          if (!validTypes.includes(file.type)) {
            throw new Error(
              `Invalid image type: ${file.type}. Only JPEG, PNG, and WEBP are allowed`
            );
          }

          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(
              `Image too large: ${file.name}. Maximum size is 5MB`
            );
          }

          payload.append("images", file);
        }
      });

      console.log("Submitting product update with:", {
        name: formData.get("name"),
        price,
        quantity,
        existingImages: existingImages.length,
        deletedImages: deletedImages.length,
        newImages: imageFiles.length,
      });

      // Show loading toast
      const toastId = toast.loading("Updating product...", {
        position: "top-right",
      });

      const response = await fetch(
        `/api/auth/product/${currentProduct._id}/update`,
        {
          method: "PUT",
          body: payload,
          credentials: "include",
          headers: {
            // Don't set Content-Type - let the browser set it with boundary
            "Cache-Control": "no-store",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || "Failed to update product"
        );
      }

      const result = await response.json();
      const updatedProduct = result.product?.product || result.product;

      if (!updatedProduct || !updatedProduct._id) {
        throw new Error("Invalid response from server");
      }

      // Update state and UI
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
      setIsEditModalOpen(false);
      // Update toast to success
      toast.update(toastId, {
        render: "Product updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      router.refresh();
    } catch (err) {
      console.error("Edit product error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleCreateProduct = async (formData: CreateProductFormData) => {
  //   try {
  //     setIsSubmitting(true);
  //     setError(null);

  //     // Basic validation
  //     if (!formData.name?.trim()) {
  //       throw new Error("Product name is required");
  //     }

  //     const formDataToSend = new FormData();
  //     formDataToSend.append("name", formData.name.trim());
  //     formDataToSend.append("description", formData.description?.trim() || "");
  //     formDataToSend.append("price", formData.price.toString());
  //     formDataToSend.append("category", formData.category);
  //     formDataToSend.append("quantity", formData.quantity.toString());
  //     formDataToSend.append("brand", formData.brand?.trim() || "Unbranded");

  //     // Append images
  //     formData.images.forEach((image) => {
  //       if (typeof image === "string") {
  //         formDataToSend.append("images", image);
  //       } else {
  //         formDataToSend.append("images", image);
  //       }
  //     });

  //     const toastId = toast.loading("Creating new product...", {
  //       position: "top-right",
  //     });

  //     const response = await fetch("/api/auth/product/create", {
  //       method: "POST",
  //       credentials: "include",
  //       body: formDataToSend,
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       if (result.error === "Slug conflict") {
  //         throw new Error(
  //           result.details +
  //             ". " +
  //             (result.suggestion || "Please try a different name.")
  //         );
  //       }
  //       throw new Error(
  //         result.error || result.message || "Failed to create product"
  //       );
  //     }

  //     setProducts((prev) => [result.product, ...prev]);
  //     setIsCreateModalOpen(false);
  //     // Update toast to success
  //     toast.update(toastId, {
  //       render: result.message || "Product created successfully!",
  //       type: "success",
  //       isLoading: false,
  //       autoClose: 3000,
  //       closeButton: true,
  //     });
  //   } catch (err) {
  //     console.error("Creation error:", err);
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Failed to create product";
  //     setError(errorMessage);
  //     toast.error(errorMessage, {
  //       position: "top-right",
  //       autoClose: 5000,
  //       closeButton: true,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

// Update the handleCreateProduct function
const handleCreateProduct = async (formData: CreateProductFormData) => {
  try {
    setIsSubmitting(true);
    setError(null);

    // Basic validation
    if (!formData.name?.trim()) {
      throw new Error("Product name is required");
    }

    const formDataToSend = new FormData();
    
    // Append all product data
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("description", formData.description?.trim() || "");
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("category", formData.category);
    formDataToSend.append("quantity", formData.quantity.toString());
    formDataToSend.append("brand", formData.brand?.trim() || "Unbranded");

    // Handle image uploads - only append files (not URLs)
    if (formData.images && formData.images.length > 0) {
      // Convert to array if it isn't already
      const imagesArray = Array.isArray(formData.images) 
        ? formData.images 
        : [formData.images];
      
      // Process each image
      for (const image of imagesArray) {
        if (image instanceof File) {
          // Validate file type
          const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
          if (!validTypes.includes(image.type)) {
            console.warn(`Skipping invalid file type: ${image.name}`);
            continue;
          }
          
          // Validate file size (max 5MB)
          if (image.size > 5 * 1024 * 1024) {
            console.warn(`File too large (${image.name}): ${image.size} bytes`);
            continue;
          }
          
          formDataToSend.append("images", image);
        }
      }
    }

    // Debug: Log form data before sending
    console.log("FormData contents:");
    for (const [key, value] of formDataToSend.entries()) {
      if (key === "images") {
        console.log(key, (value as File).name, (value as File).size + " bytes");
      } else {
        console.log(key, value);
      }
    }

    const toastId = toast.loading("Creating new product...", {
      position: "top-right",
    });

    const response = await fetch("/api/auth/product/create", {
      method: "POST",
      credentials: "include",
      body: formDataToSend,
      // Note: Don't set Content-Type header - let browser set it with boundary
    });

    // Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend error response:", errorData);
      
      let errorMessage = errorData.error || errorData.message || "Failed to create product";
      
      // Handle specific error cases
      if (errorData.missingFields) {
        errorMessage += ` (Missing: ${errorData.missingFields.join(", ")})`;
      }
      if (errorData.details) {
        errorMessage += ` - ${errorData.details}`;
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Product created successfully:", result.product);

    // Update state
    setProducts((prev) => [result.product, ...prev]);
    setIsCreateModalOpen(false);
    
    // Show success toast
    toast.update(toastId, {
      render: result.message || "Product created successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      closeButton: true,
    });

    return result.product;

  } catch (err) {
    console.error("Product creation error:", err);
    
    const errorMessage = err instanceof Error 
      ? err.message 
      : "Failed to create product";
    
    setError(errorMessage);
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      closeButton: true,
    });
    
    throw err; // Re-throw for calling code if needed
  } finally {
    setIsSubmitting(false);
  }
};

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown date";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="container !mx-auto !px-4 !py-8">
        <div className="flex justify-between items-center !my-8">
          <h1 className="!text-2xl font-bold text-gray-800">Products</h1>
          <button
            disabled
            className="bg-gray-400 text-white !px-4 !py-2 rounded-md !text-sm !font-medium"
          >
            Create Product
          </button>
        </div>
        <div className="text-center !py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            <Spinner color="#6e2eff" size="lg" />
          </p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="container mx-auto !px-4 !py-8">
        <div className="flex justify-between items-center !my-8">
          <h1 className="!text-2xl !font-bold text-gray-800">Products</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white !px-4 !py-2 rounded-md !text-sm !font-medium"
          >
            Create Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto !px-4 !py-8">
      <div className="flex justify-between items-center !my-4">
        <h1 className="!text-2xl !font-bold text-gray-800">Products</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="!bg-[#6e2eff] hover:bg-[#a484ee] !text-white !px-4 !py-4 rounded-md !text-sm !font-medium cursor-pointer"
        >
          Create Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 !p-4 !my-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className=" bg-gray-200 overflow-hidden">
                <Image
                 src={getProductImageUrl(product.images?.[0]?.url)}
                  alt={product.name}
                  width={300}
                  height={300}
                  layout="responsive"
                  objectFit="cover"
                  unoptimized={!product.images?.[0]?.url?.includes('res.cloudinary.com')} // Only optimize Cloudinary images
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/shop/vr000.webp'; // Directly use local fallback
                    target.onerror = null; // Prevent infinite loop
                  }}
                />
              </div>
              <div className="!p-4">
                <h3 className="!text-lg !font-semibold text-gray-800 !mb-1 truncate">
                  {product.name}
                </h3>
                <p className="!text-gray-600 !mb-2">
                  ${product.price?.toFixed(2) || "0.00"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Last updated: {formatDate(product.updatedAt)}
                  </span>
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <AiOutlineEdit size={30} />
                  </button>
                  {isEditModalOpen && currentProduct && (
                    <EditProductModal
                      isOpen={isEditModalOpen}
                      onClose={() => setIsEditModalOpen(false)}
                      onSubmit={handleEditProduct}
                      isSubmitting={isSubmitting}
                      initialData={currentProduct} // Add this prop
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No products
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new product.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Product
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 !bg-gray-200 bg-opacity-50 flex items-center justify-center !p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="!p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="!text-xl font-bold text-gray-800 cursor-pointer">
                  Create New Product
                </h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <ProductForm
                onSubmit={handleCreateProduct}
                isSubmitting={isSubmitting}
                onClose={() => setIsCreateModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
