"use client";
import { useState, useEffect } from "react";
import { Product } from "@/lib/product";
import { Select, Portal } from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";
import { getProductImageUrl } from "@/lib/imageUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface Category {
  _id: string;
  main: string;
  sub?: string;
  tags?: string[];
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
  initialData: Product;
}

const EditProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
}: EditProductModalProps) => {
  const [formData, setFormData] = useState<Partial<Product>>(initialData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  // Add this with the other state declarations
const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Create collection for Chakra UI Select
  const categoryCollection = createListCollection({
    items: categories.map((category) => ({
      label: category.main,
      value: category._id,
      sub: category.sub,
    })),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        category:
          typeof initialData.category === "object"
            ? initialData.category._id
            : initialData.category || "",
      });
    }
  }, [initialData]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "/api/auth/categories"
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeExistingImage = (index: number) => {
    if (!formData.images || !formData.images[index]) return;
    
    const imageToDelete = formData.images[index];
    let imageUrl = '';
    
    if (typeof imageToDelete === 'object' && imageToDelete.url) {
      imageUrl = imageToDelete.url;
    } else if (typeof imageToDelete === 'string') {
      imageUrl = imageToDelete;
    }
  
    if (imageUrl) {
      // Remove protocol and domain if present (handles both full URLs and relative paths)
      const cleanUrl = imageUrl.replace(/^https?:\/\/[^/]+/, '');
      setDeletedImages(prev => [...prev, cleanUrl]);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "images") {
            // Handle existing images
            if (Array.isArray(value)) {
              value.forEach(img => {
                if (typeof img === 'object' && img.url) {
                  formDataToSend.append("existingImages", img.url);
                } else if (typeof img === 'string') {
                  formDataToSend.append("existingImages", img);
                }
              });
            }
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      // Append deleted images to be removed
      deletedImages.forEach(url => {
        formDataToSend.append("deletedImages", url);
      });

      // Append new image files
      imageFiles.forEach(file => {
        formDataToSend.append("images", file);
      });

      console.log("Submitting form data:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      await onSubmit(formDataToSend);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update product";
      setError(message);
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center !p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="!p-6">
          <div className="flex justify-between items-center !my-4">
            <h2 className="!text-xl font-bold text-gray-800">Edit Product</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
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

          <form onSubmit={handleSubmit} className="!space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block !text-sm !font-medium text-gray-700 !mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 !p-2 !border"
                />
              </div>

              {/* Category - Using Chakra UI v3 Select */}
              <div className="col-span-2 md:col-span-1">
                <label className="block !text-sm !font-medium text-gray-700 !my-1">
                  Category
                </label>
                {loadingCategories ? (
                  <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
                ) : (
                  <Select.Root
                    collection={categoryCollection}
                    value={
                      formData.category ? [formData.category.toString()] : []
                    }
                    onValueChange={(e) =>
                      handleCategoryChange(e.value[0] || "")
                    }
                    width="100%"
                  >
                    <Select.HiddenSelect name="category" required />
                    <Select.Control>
                      <Select.Trigger className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 !p-2 !border">
                        <Select.ValueText placeholder="Select category">
                          {formData.category
                            ? categories.find(
                                (c) => c._id === formData.category
                              )?.main || "Select category"
                            : "Select category"}
                        </Select.ValueText>
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {categoryCollection.items.map((category) => (
                            <Select.Item
                              item={category}
                              key={category.value}
                              className="!p-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {category.label}-{category.sub}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )}
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block !text-sm !font-medium text-gray-700 !mb-1"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || 0}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 !p-2 !border"
                />
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="quantity"
                  className="block !text-sm !font-medium text-gray-700 !mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity || 0}
                  onChange={handleChange}
                  min={0}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 !p-2 !border"
                />
              </div>

              {/* Brand */}
              <div>
                <label
                  htmlFor="brand"
                  className="block !text-sm !font-medium text-gray-700 !mb-1"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 !p-2 !border"
                />
              </div>

              {/* Current Images Preview */}
              {formData.images && formData.images.length > 0 && (
                <div className="col-span-2">
                  <label className="block !text-sm !font-medium text-gray-700 !mb-1">
                    Current Images (Click × to remove)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={getProductImageUrl(
                            typeof img === "string" ? img : img.url
                          )}
                          width={1200}
                          height={400}
                          alt={`Product preview ${index}`}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {imageFiles.length > 0 && (
                <div className="col-span-2">
                  <label className="block !text-sm !font-medium text-gray-700 !mb-1">
                    New Images to Upload (Click × to remove)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index}`}
                          width={1200}
                          height={400}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div className="col-span-2">
                <label
                  htmlFor="images"
                  className="block !text-sm !font-medium text-gray-700 !mb-1"
                >
                  {imageFiles.length > 0 ? 'Add More Images' : 'Add Images'}
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="!mt-1 block w-full !text-sm text-gray-500 file:!mr-4 file:!py-2 file:!px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="!mt-1 !text-xs text-gray-500">
                  Select multiple images (hold Ctrl/Cmd to select multiple)
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block !text-sm !font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 !p-2 !border"
              />
            </div>

            <div className="flex justify-end !space-x-3 !py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="!px-4 !py-2 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="!px-4 !py-2 border border-transparent !bg-[#6e2eff] shadow-sm text-sm font-medium !text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;