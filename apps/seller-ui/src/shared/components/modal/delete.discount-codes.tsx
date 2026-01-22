import { X } from 'lucide-react';
import React from 'react';

const DeleteDiscountModal = ({
  discount,
  onClose,
  onConfirm,
}: {
  discount: any;
  onClose: () => void;
  onConfirm?: any;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-4">
          <h3 className="text-xl text-white">Delete Discount Code</h3>
          <button onClick={onClose}>
            <X className="text-white" size={22} />
          </button>
        </div>

        {/* Content */}
        <div>
          <p className="text-gray-300 mt-4">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-white">
              {discount.public_name}
            </span>
            <br />
            This action ** cannot be undone**
          </p>
          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountModal;
