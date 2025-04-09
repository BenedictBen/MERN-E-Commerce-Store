"use client";
import { useForm } from "react-hook-form";
import { CreateProductFormData } from "@/lib/product";
import { useState, useRef, useEffect } from "react";

interface ProductFormProps {
  onSubmit: (data: CreateProductFormData) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

interface Category {
  _id: string;
  main: string;
  sub: string;
  tags: string[];
}

interface ImagePreview {
  url: string;
  file?: File;
}

const ProductForm = ({ onSubmit, isSubmitting, onClose }: ProductFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewImages, setPreviewImages] = useState<ImagePreview[]>([]);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "/api/auth/categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<CreateProductFormData>({
    defaultValues: {
      images: [],
    },
  });


// In ProductForm.tsx, modify the handleFileChange function
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  const invalidFiles = files.filter(
    (file) => !validTypes.includes(file.type)
  );

  if (invalidFiles.length > 0) {
    setError("Please upload valid images (JPEG, PNG, or WEBP)");
    return;
  }

  setError("");
  setUrlInput("");

  // Keep existing previews and add new ones
  setPreviewImages(prev => [
    ...prev,
    ...files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }))
  ]);

  // Update form values with all files
  setValue("images", [...(watch("images") || []), ...files]);
  trigger("images");
};

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setUrlInput(url);
  
    if (url) {
      // Validate URL format
      const isValidUrl = /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
      if (!isValidUrl) {
        setError("URL must end with .jpg, .jpeg, .png, .webp, or .gif");
        return;
      }
  
      setError("");
      setPreviewImages([{ url }]);
      setValue("images", [url]);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
    } else {
      setPreviewImages([]);
      setValue("images", []);
    }
    trigger("images");
  };

  const handleClear = () => {
    setPreviewImages([]);
    setUrlInput("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue("images", []);
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => {
        if (image.url.startsWith('blob:')) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [previewImages]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="!space-y-4 !py-6 !px-6">
      {/* Product Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Product name is required" })}
          className="mt-1 block !py-3 !px-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Image Input Field */}
      <div className="space-y-2">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Product Images
        </label>

        {/* URL Input */}
        <div>
          <input
            id="imageUrl"
            type="text"
            placeholder="Enter image URL"
            value={urlInput}
            onChange={handleUrlChange}
            className="mt-1 block !py-3 !px-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">OR</span>
          </div>
        </div>

        {/* File Upload */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="imageUpload"
            multiple
          />
          <label
            htmlFor="imageUpload"
            className="flex-1 px-4 !py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer text-center"
          >
            Upload Images
          </label>
          {(previewImages.length > 0 || urlInput) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 !py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Clear
            </button>
          )}
        </div>

        {/* Error messages */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
        )}

        {/* Selected files info */}
        <p className="text-xs text-gray-500 mt-1">
          {fileInputRef.current?.files?.length
            ? `${fileInputRef.current.files.length} file(s) selected`
            : previewImages.length > 0
            ? "1 URL entered"
            : "No images selected"}
        </p>

        {/* Hidden field for form validation */}
        <input
          type="hidden"
          {...register("images", {
            validate: (value) => {
              if (!value || value.length === 0) {
                return "At least one image is required";
              }
              return true;
            },
          })}
        />
      </div>

      {/* Image Preview */}
      {previewImages.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 mb-1">Preview</p>
          <div className="w-full grid grid-cols-3 gap-4">
            {previewImages.map((image, index) => (
              <div
                key={index}
                className="w-full h-48 bg-gray-100 rounded-md overflow-hidden border border-gray-300"
              >
                <img
                  src={image.url}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/default-product.jpg";
                  }}
                />
                {image.file && (
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {image.file.name}
            </span>
          )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Field */}
      <div>
        <label
          htmlFor="brand"
          className="block text-sm font-medium text-gray-700"
        >
          Brand
        </label>
        <input
          id="brand"
          type="text"
          {...register("brand")}
          className="mt-1 block !py-3 !px-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Quantity Field */}
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          {...register("quantity", {
            required: "Quantity is required",
            min: { value: 0, message: "Quantity must be at least 0" },
            valueAsNumber: true,
          })}
          className="mt-1 block !py-3 !px-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          {...register("category", { required: "Category is required" })}
          className="mt-1 block !py-3 !px-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.main}{" "}
             
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 50,
              message: "Description must be at least 50 characters",
            },
          })}
          className="mt-1 block !py-3 !px-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price Field */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be at least 0" },
            valueAsNumber: true,
          })}
          className="mt-1 block !py-3 !px-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end !space-x-3 !py-4 gap-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center rounded-md !border-2 border-[#6e2eff] bg-white !px-4 !py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-offset-2 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent !bg-[#6e2eff] hover:bg-[#a484ee] !px-4 !py-2 text-sm font-medium !text-white shadow-sm  focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
