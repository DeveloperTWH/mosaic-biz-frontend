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
            onClick={(e) => {
              const btn = e.currentTarget;
              btn.disabled = true;
              btn.innerHTML = `
      <svg class="w-4 h-4 mr-2 animate-spin inline-block" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      Deleting...`;
              onConfirm();
            }}
            className="px-4 py-1 text-sm text-white bg-red-600 rounded flex items-center justify-center min-w-[120px]"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
