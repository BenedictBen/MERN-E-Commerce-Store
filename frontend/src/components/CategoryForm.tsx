interface Category {
  _id: string;
  main: string;
  sub: string;
  tags: string[];
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineClose,  } from "react-icons/ai";

import 'react-toastify/dist/ReactToastify.css';


interface CategoryFormProps {
  initialData?: {
    main: string;
    subs: { sub: string; tags: string }[]; // tags as string for input
  };
  onSubmit: (data: { 
    main: string; 
    subs: { sub: string; tags: string }[] // tags as string for input
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  title: string;
  submitButtonText?: string;
}


const CategoryForm = ({ 
  initialData = { main: '', subs: [{ sub: '', tags: '' }] },
  onSubmit,
  onCancel,
  isSubmitting,
  title,
  submitButtonText = 'Save'
}: CategoryFormProps) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, subIndex?: number) => {
    const { name, value } = e.target;
    
    if (subIndex !== undefined && name !== 'main') {
      const updatedSubs = [...formData.subs];
      updatedSubs[subIndex] = {
        ...updatedSubs[subIndex],
        [name]: value
      };
      setFormData(prev => ({ ...prev, subs: updatedSubs }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addSubcategory = () => {
    setFormData(prev => ({
      ...prev,
      subs: [...prev.subs, { sub: '', tags: '' }]
    }));
  };

  const removeSubcategory = (index: number) => {
    if (formData.subs.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      subs: prev.subs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      main: formData.main,
      subs: formData.subs.map(sub => ({
        sub: sub.sub,
        tags: sub.tags // Keep as string, conversion happens in parent
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="!space-y-4">
    <div className="!flex !justify-between !items-center !mb-4">
      <h2 className="!text-xl !font-bold !text-gray-800">{title}</h2>
      <button
        type="button"
        onClick={onCancel}
        className="!text-gray-500 hover:!text-gray-700 cursor-pointer"
        disabled={isSubmitting}
      >
        <AiOutlineClose className="!h-6 !w-6" />
      </button>
    </div>
    
    <div className="!mb-4">
      <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">
        Main Category *
      </label>
      <input
        type="text"
        name="main"
        value={formData.main}
        onChange={handleInputChange}
        className="!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md !shadow-sm focus:!outline-none focus:!ring-indigo-500 focus:!border-indigo-500"
        required
      />
    </div>
    
    {formData.subs.map((sub, index) => (
      <div key={index} className="!border !p-4 !rounded-lg">
        <div className="!flex !justify-between !items-center !mb-2">
          <h3 className="!text-md !font-medium !text-gray-700">
            Subcategory {index + 1}
          </h3>
          {formData.subs.length > 1 && (
            <button
              type="button"
              onClick={() => removeSubcategory(index)}
              className="!text-red-500 hover:!text-red-700 !text-sm"
            >
              Remove
            </button>
          )}
        </div>
        
        <div className="!mb-4">
          <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">
            Sub Category *
          </label>
          <input
            type="text"
            name="sub"
            value={sub.sub}
            onChange={(e) => handleInputChange(e, index)}
            className="!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md !shadow-sm focus:!outline-none focus:!ring-indigo-500 focus:!border-indigo-500"
            required
          />
        </div>
        
        <div className="!mb-4">
          <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={sub.tags}
            onChange={(e) => handleInputChange(e, index)}
            className="!w-full !px-3 !py-2 !border !border-gray-300 !rounded-md !shadow-sm focus:!outline-none focus:!ring-indigo-500 focus:!border-indigo-500"
            placeholder="tag1, tag2, tag3"
          />
        </div>
      </div>
    ))}
    
    <button
      type="button"
      onClick={addSubcategory}
      className="!text-indigo-600 hover:!text-indigo-800 !text-sm !font-medium !mb-4"
    >
      + Add Subcategory
    </button>
    
    <div className="!flex !justify-end !space-x-3 !mt-6">
      <button
        type="button"
        onClick={onCancel}
        className="!px-4 !py-2 !border !border-gray-300 !rounded-md !text-sm !font-medium !text-gray-700 hover:!bg-gray-50 cursor-pointer"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="!px-4 !py-2 !bg-indigo-600 !text-white !rounded-md !text-sm !font-medium hover:!bg-indigo-700 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-indigo-500 cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : submitButtonText}
      </button>
    </div>
  </form>
  );
};

export default CategoryForm