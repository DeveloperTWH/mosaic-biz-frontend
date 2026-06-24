// components/DeleteConfirmationModal.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message: string;
  loading?: boolean;
  confirmLabel?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onCancel,
  onConfirm,
  title = 'Confirm Delete',
  message,
  loading = false,
  confirmLabel = 'Confirm Delete'
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-red-600">{title}</h3>
        <p className="mb-4 text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-1 text-sm text-gray-600 bg-gray-200 rounded disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-1 text-sm text-white bg-red-600 rounded flex items-center justify-center min-w-[120px] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
