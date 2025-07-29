// components/DeleteConfirmationModal.tsx
import React from 'react';

interface DeleteConfirmationModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onCancel,
  onConfirm,
  title = 'Confirm Delete',
  message
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-red-600">{title}</h3>
        <p className="mb-4 text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm text-gray-600 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 text-sm text-white bg-red-600 rounded"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
