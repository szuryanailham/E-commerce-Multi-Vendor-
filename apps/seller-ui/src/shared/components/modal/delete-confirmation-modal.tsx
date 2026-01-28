import { X } from 'lucide-react';
import React from 'react';

const DeleteConfirmationModal = ({
  product,
  onClose,
  onConfirm,
  onRestore,
}: any) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[450px] max-w-[90%] shadow-lg">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Delete Product</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <p className="text-gray-300 mt-4">
          Are you sure you want to Delete{' '}
          <span className="font-semibold text-white">{product?.title}</span>?
          <br />
          <br />
          This Product will be moved to <strong>deleted state</strong> and
          permanently removed <strong>after 24 hours</strong>. You can recover
          it within this time.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={!product?.isDeleted ? onConfirm : onRestore}
            className={`px-4 py-2 rounded-md text-white transition ${
              product?.isDeleted
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {product?.isDeleted ? 'Restore Product' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
