"use client";

type BusinessStatusModalProps = {
  isOpen: boolean;
  businessName: string;
  remark: string;
  setRemark: (value: string) => void;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const BusinessStatusModal = ({
  isOpen,
  businessName,
  remark,
  setRemark,
  loading = false,
  onClose,
  onConfirm,
}: BusinessStatusModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-gray-900">Deactivate business</h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to deactivate <span className="font-semibold">{businessName}</span>?
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Remark
          </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={4}
            placeholder="Policy violation: missing required business documents."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-2 text-xs text-gray-500">
            This remark will be sent with the deactivation request.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deactivating..." : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessStatusModal;
