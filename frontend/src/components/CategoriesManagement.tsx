

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineClose,
  AiOutlinePlus,
} from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryForm from "@/components/CategoryForm";
import DeleteCategoryModal from "./DeleteCategoryModal";

interface SubCategory {
  sub: string;
  tags: string[];
}

interface Category {
  _id: string;
  main: string;
  subs: SubCategory[];  // Changed from 'sub' to 'subs' array
}


const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null); 

        const response = await fetch("/api/auth/categories", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch categories (Status: ${response.status})`
          );
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Fetch categories error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setCurrentCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsSubmitting(true);
      // Show loading toast
      const toastId = toast.loading(
        `Deleting "${categoryToDelete.main}" category...`,
        {
          position: "top-right",
        }
      );
      const response = await fetch(
        `/api/auth/categories/${categoryToDelete._id}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories(
        categories.filter((cat) => cat._id !== categoryToDelete._id)
      );
      // Update to success
      toast.update(toastId, {
        render: `"${categoryToDelete.main}" category deleted successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Delete category error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (data: {
    main: string;
    sub: string;
    tags: string[];
  }) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("main", data.main);
      formData.append("sub", data.sub);
      formData.append("tags", data.tags.join(",")); // Convert array to comma-separated string

      // Show loading toast
      const toastId = toast.loading(`Creating "${data.main}" category...`, {
        position: "top-right",
      });

      const response = await fetch("/api/auth/categories/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Server returned non-JSON response");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create category");
      }

      setCategories([result.category, ...categories]);
      setIsCreateModalOpen(false);
      // Update to success
      toast.update(toastId, {
        render: `"${data.main}" category created successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    } catch (err) {
      console.error("Create category error:", err);

      let errorMessage = "Failed to create category";
      if (err instanceof Error) {
        errorMessage = err.message;
        // Remove any HTML tags from the error message if present
        errorMessage = errorMessage.replace(/<[^>]*>?/gm, "");
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: {
    main: string;
    subs: { sub: string; tags: string[] }[];
  }) => {
    if (!currentCategory) return;
  
    try {
      setIsSubmitting(true);
      
      const toastId = toast.loading(
        `Updating "${currentCategory.main}" category...`,
        { position: "top-right" }
      );
  
      const response = await fetch(
        `/api/auth/categories/${currentCategory._id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            main: data.main,
            subs: data.subs
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update category");
      }
  
      const updatedCategory = await response.json();
      
      // Ensure we're using the correct data structure when updating state
      setCategories(categories.map(cat => 
        cat._id === currentCategory._id ? {
          ...updatedCategory.category,
          subs: updatedCategory.category.subs || [] // Ensure subs exists
        } : cat
      ));
      
      setIsEditModalOpen(false);
      setCurrentCategory(null); // Clear current category after update
  
      toast.update(toastId, {
        render: `Category updated successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    } catch (err) {
      console.error("Update category error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="!container !mx-auto !px-4 !py-8">
        <div className="flex justify-between items-center !mb-8">
          <h1 className="!text-2xl !font-bold !text-gray-800">Categories</h1>
          <button
            disabled
            className="!bg-gray-400 !text-white !px-4 !py-2 !rounded-md !text-sm !font-medium"
          >
            Create Category
          </button>
        </div>
        <div className="!flex !justify-center !items-center !h-64">
          <div className="!animate-spin !rounded-full !h-12 !w-12 !border-b-2 !border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="!container !mx-auto !px-4 !py-8">
      <div className="!flex !justify-between !items-center !mb-8">
        <h1 className="!text-2xl !font-bold !text-gray-800">Categories</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="!bg-[#6e2eff] hover:!bg-[#a484ee] !text-white !px-4 !py-2 !rounded-md !text-sm !font-medium !flex !items-center !gap-2 cursor-pointer"
        >
          <AiOutlinePlus className="!h-4 !w-4" />
          Create Category
        </button>
      </div>

      {error && (
        <div className="!bg-red-50 !border-l-4 !border-red-500 !p-4 !mb-4">
          <div className="!flex">
            <div className="!flex-shrink-0">
              <svg
                className="!h-5 !w-5 !text-red-500"
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
            <div className="!ml-3">
              <p className="!text-sm !text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

<div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-6">
      {categories.map((category) => (
        <div
          key={category._id}
          className="!bg-white !rounded-lg !shadow-md !overflow-hidden !border !border-gray-200 hover:!shadow-lg !transition-shadow"
        >
          <div className="!p-6">
            <div className="!flex !justify-between !items-start">
              <div>
                <h3 className="!text-lg !font-semibold !text-gray-800">
                  {category.main}
                </h3>
              </div>
              <div className="!flex !space-x-2">
                <button
                  onClick={() => handleEditClick(category)}
                  className="!text-indigo-600 hover:!text-indigo-800 !p-1 !rounded-full hover:!bg-indigo-50 cursor-pointer"
                  aria-label="Edit category"
                >
                  <AiOutlineEdit className="!h-5 !w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(category)}
                  className="!text-red-600 hover:!text-red-800 !p-1 !rounded-full hover:!bg-red-50 cursor-pointer"
                  aria-label="Delete category"
                >
                  <AiOutlineDelete className="!h-5 !w-5" />
                </button>
              </div>
            </div>

            {category.subs?.map((subcategory, subIndex) => (
              <div key={`${category._id}-${subIndex}`} className="!mt-4">
                <h4 className="!text-md !font-medium !text-gray-700">
                  {subcategory.sub}
                </h4>
                {subcategory.tags?.length > 0 && (
                  <div className="!flex !flex-wrap !gap-2 !mt-2">
                    {subcategory.tags.map((tag, tagIndex) => (
                      <span
                        key={`${category._id}-${subIndex}-${tagIndex}`}
                        className="!bg-gray-100 !text-gray-800 !text-xs !px-2 !py-1 !rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

      {isDeleteModalOpen && categoryToDelete && (
        <DeleteCategoryModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={`${categoryToDelete.main}`}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="!fixed !inset-0 !bg-white !bg-opacity-50 !flex !items-center !justify-center !z-50 !p-4">
          <div className="!bg-white !rounded-lg !shadow-xl !max-w-md !w-full !max-h-[90vh] !overflow-y-auto">
          <div className="!p-6">
  <CategoryForm
    initialData={{ 
      main: "", 
      subs: [{ sub: "", tags: "" }] 
    }}
    onSubmit={async (formData) => {
      await handleCreate({
        main: formData.main,
        sub: formData.subs[0].sub,
        tags: formData.subs[0].tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
      });
    }}
    onCancel={() => setIsCreateModalOpen(false)}
    isSubmitting={isSubmitting}
    title="Create New Category"
    submitButtonText="Create" // Add this
  />
</div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentCategory && (
        <div className="!fixed !inset-0 !bg-gray-100 !bg-opacity-50 !flex !items-center !justify-center !z-50 !p-4">
          <div className="!bg-white !rounded-lg !shadow-xl !max-w-md !w-full !max-h-[90vh] !overflow-y-auto">
            <div className="!p-6">
            <CategoryForm
          initialData={{
            main: currentCategory.main,
            subs: (currentCategory.subs || []).map(sub => ({
              sub: sub.sub,
              tags: (sub.tags || []).join(', ')
            }))
          }}
          onSubmit={async (formData) => {
            await handleUpdate({
              main: formData.main,
              subs: formData.subs.map(sub => ({
                sub: sub.sub,
                tags: sub.tags
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag)
              }))
            });
          }}
          onCancel={() => {
            setIsEditModalOpen(false);
            setCurrentCategory(null);
          }}
          isSubmitting={isSubmitting}
          title="Edit Category"
          submitButtonText="Update"
        />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
