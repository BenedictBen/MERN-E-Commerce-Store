"use client";

import { AiOutlineClose } from "react-icons/ai";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isSubmitting: boolean;
}

const DeleteCategoryModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isSubmitting,
}: DeleteCategoryModalProps) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center !p-5 z-50">
      <div className="bg-white !p-6 rounded-lg !max-w-md !w-full">
        <div className="flex justify-between items-center !my-4">
          <h3 className="!text-lg !font-bold">Confirm Deletion</h3>
          <button 
            onClick={onClose} 
            className="!text-gray-500 hover:!text-gray-700 cursor-pointer"
            disabled={isSubmitting}
          >
            <AiOutlineClose className="!h-5 !w-5" />
          </button>
        </div>
        
        <p className="!my-2">
          Are you sure you want to delete the category 
        </p>
        <p className="!my-2">"{itemName}"? </p>
        <p className="!my-2">This action cannot be undone.</p>
        
        <div className="flex justify-end !space-x-3">
          <button
            onClick={onClose}
            className="!px-4 !py-2 !border border-gray-300 rounded-md !text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="!px-4 !py-2 !bg-red-600 !text-white rounded-md !text-sm !font-medium hover:bg-red-700 focus:outline-none disabled:opacity-50 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;