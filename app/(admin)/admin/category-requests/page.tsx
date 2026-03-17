'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, Clock3, FolderPlus, Layers3, RefreshCcw, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal from '../categories-management/components/Modal';
import CreateCategoryModal from '../categories-management/components/CreateCategoryModal';

type CategoryRequestStatus = 'pending' | 'approved' | 'rejected';
type CategoryType = 'product' | 'service' | 'food';
type CategoryModalType =
  | 'product'
  | 'service'
  | 'food'
  | 'product-subcategory'
  | 'service-subcategory'
  | 'food-subcategory';

interface RequestUser {
  _id?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface CategoryRequest {
  _id: string;
  requestedBy?: string | RequestUser;
  categoryType: CategoryType;
  categoryName: string;
  subcategoryName?: string;
  description: string;
  status: CategoryRequestStatus;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryOption {
  _id: string;
  name: string;
}

interface CategoryDataResponse {
  productCategories?: CategoryOption[];
  serviceCategories?: CategoryOption[];
  foodCategories?: CategoryOption[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getRequestList = (payload: any): CategoryRequest[] => {
  const directList = payload?.data;
  if (Array.isArray(directList)) {
    return directList;
  }

  if (Array.isArray(directList?.requests)) {
    return directList.requests;
  }

  if (Array.isArray(payload?.requests)) {
    return payload.requests;
  }

  return [];
};

const formatUser = (requestedBy?: string | RequestUser) => {
  if (!requestedBy) {
    return 'Unknown user';
  }

  if (typeof requestedBy === 'string') {
    return requestedBy;
  }

  const name = requestedBy.name?.trim();
  if (name) {
    return name;
  }

  const fullName = `${requestedBy.firstName || ''} ${requestedBy.lastName || ''}`.trim();
  if (fullName) {
    return fullName;
  }

  return requestedBy.email || requestedBy._id || 'Unknown user';
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleString();
};

const getStatusClasses = (status: CategoryRequestStatus) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
};

const buildModalType = (
  categoryType: CategoryType,
  mode: 'category' | 'subcategory'
): CategoryModalType => {
  return mode === 'category'
    ? categoryType
    : (`${categoryType}-subcategory` as CategoryModalType);
};

export default function AdminCategoryRequestsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<CategoryRequest[]>([]);
  const [productCategories, setProductCategories] = useState<CategoryOption[]>([]);
  const [serviceCategories, setServiceCategories] = useState<CategoryOption[]>([]);
  const [foodCategories, setFoodCategories] = useState<CategoryOption[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<CategoryRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [creationPromptRequest, setCreationPromptRequest] = useState<CategoryRequest | null>(null);
  const [createModalType, setCreateModalType] = useState<CategoryModalType | null>(null);
  const [createModalInitialValues, setCreateModalInitialValues] = useState<{
    name?: string;
    description?: string;
    categoryId?: string;
  } | null>(null);

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === 'pending').length,
    [requests]
  );
  const approvedCount = useMemo(
    () => requests.filter((request) => request.status === 'approved').length,
    [requests]
  );
  const rejectedCount = useMemo(
    () => requests.filter((request) => request.status === 'rejected').length,
    [requests]
  );

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/category-requests`, {
        withCredentials: true,
      });
      setRequests(getRequestList(response.data));
    } catch (error) {
      console.error('Error fetching category requests:', error);
      toast.error('Failed to load category requests');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/categories`, {
        withCredentials: true,
      });

      const data: CategoryDataResponse = response.data?.data || {};
      setProductCategories(data.productCategories || []);
      setServiceCategories(data.serviceCategories || []);
      setFoodCategories(data.foodCategories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load category options');
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchRequests(), fetchCategories()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleApprove = async (request: CategoryRequest) => {
    try {
      setActionLoadingId(request._id);
      await axios.put(
        `${API_BASE_URL}/api/admin/category-requests/${request._id}/approve`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success('Category request approved');
      setRequests((prev) =>
        prev.map((item) =>
          item._id === request._id ? { ...item, status: 'approved' } : item
        )
      );
      setCreationPromptRequest({ ...request, status: 'approved' });
    } catch (error: any) {
      console.error('Error approving category request:', error);
      toast.error(error.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingRequest) {
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    try {
      setActionLoadingId(rejectingRequest._id);
      await axios.put(
        `${API_BASE_URL}/api/admin/category-requests/${rejectingRequest._id}/reject`,
        { rejectionReason: rejectionReason.trim() },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Category request rejected');
      setRequests((prev) =>
        prev.map((item) =>
          item._id === rejectingRequest._id
            ? {
                ...item,
                status: 'rejected',
                rejectionReason: rejectionReason.trim(),
              }
            : item
        )
      );
      setRejectingRequest(null);
      setRejectionReason('');
    } catch (error: any) {
      console.error('Error rejecting category request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openCreateModal = (
    request: CategoryRequest,
    mode: 'category' | 'subcategory'
  ) => {
    const modalType = buildModalType(request.categoryType, mode);
    const name =
      mode === 'category'
        ? request.categoryName
        : request.subcategoryName?.trim() || '';

    if (!name) {
      toast.error('No subcategory name is available for this request');
      return;
    }

    setCreateModalType(modalType);
    setCreateModalInitialValues({
      name,
      description: request.description,
    });
    setCreationPromptRequest(null);
  };

  const closeCreateModal = () => {
    setCreateModalType(null);
    setCreateModalInitialValues(null);
  };

  const handleCreateSuccess = async () => {
    closeCreateModal();
    await fetchCategories();
  };

  const categoryOptionsForType = (type: CategoryModalType | null) => {
    if (type === 'product-subcategory') {
      return { product: productCategories };
    }
    if (type === 'service-subcategory') {
      return { service: serviceCategories };
    }
    if (type === 'food-subcategory') {
      return { food: foodCategories };
    }
    return {};
  };

  const subcategoryCreateAllowed = Boolean(
    creationPromptRequest?.subcategoryName?.trim()
  );

  const modalOptions = categoryOptionsForType(createModalType);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-black">Category Requests</h1>
              <p className="mt-1 text-sm text-gray-500">
                Review vendor category requests and create categories from approved entries.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchInitialData}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-gray-600">Pending</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Approved</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-gray-900">{approvedCount}</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <X className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-gray-600">Rejected</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-gray-900">{rejectedCount}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-sm text-gray-500">Loading category requests...</div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-sm text-gray-500">No category requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Request
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Requested By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {requests.map((request) => (
                      <tr key={request._id} className="align-top">
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {request.categoryName}
                            </p>
                            {request.subcategoryName ? (
                              <p className="text-sm text-gray-600">
                                Subcategory: {request.subcategoryName}
                              </p>
                            ) : null}
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                              {request.categoryType}
                            </p>
                            <p className="max-w-md text-sm text-gray-600">
                              {request.description}
                            </p>
                            {request.rejectionReason ? (
                              <p className="text-sm text-red-600">
                                Rejection reason: {request.rejectionReason}
                              </p>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatUser(request.requestedBy)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {request.status === 'pending' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(request)}
                                  disabled={actionLoadingId === request._id}
                                  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectingRequest(request)}
                                  disabled={actionLoadingId === request._id}
                                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                                >
                                  Reject
                                </button>
                              </>
                            ) : null}

                            {request.status === 'approved' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openCreateModal(request, 'category')}
                                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                  <FolderPlus className="h-4 w-4" />
                                  Create Category
                                </button>
                                {request.subcategoryName ? (
                                  <button
                                    type="button"
                                    onClick={() => openCreateModal(request, 'subcategory')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                  >
                                    <Layers3 className="h-4 w-4" />
                                    Create Subcategory
                                  </button>
                                ) : null}
                              </>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal
        isOpen={Boolean(rejectingRequest)}
        onClose={() => {
          if (actionLoadingId) {
            return;
          }
          setRejectingRequest(null);
          setRejectionReason('');
        }}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Reject Category Request</h2>
        <p className="mb-3 text-sm text-gray-600">
          Add a reason for rejecting this request. This will be stored with the request.
        </p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={4}
          placeholder="Enter rejection reason"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setRejectingRequest(null);
              setRejectionReason('');
            }}
            disabled={Boolean(actionLoadingId)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={Boolean(actionLoadingId)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            Submit Rejection
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(creationPromptRequest)}
        onClose={() => setCreationPromptRequest(null)}
      >
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Request Approved</h2>
        <p className="mb-5 text-sm text-gray-600">
          The request is approved. Choose what you want to create from the approved values.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => creationPromptRequest && openCreateModal(creationPromptRequest, 'category')}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-left hover:bg-gray-50"
          >
            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Create Category
              </span>
              <span className="block text-sm text-gray-500">
                Prefill with "{creationPromptRequest?.categoryName || ''}"
              </span>
            </span>
            <FolderPlus className="h-4 w-4 text-gray-500" />
          </button>

          <button
            type="button"
            onClick={() =>
              creationPromptRequest && openCreateModal(creationPromptRequest, 'subcategory')
            }
            disabled={!subcategoryCreateAllowed}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-left hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Create Subcategory
              </span>
              <span className="block text-sm text-gray-500">
                {subcategoryCreateAllowed
                  ? `Prefill with "${creationPromptRequest?.subcategoryName || ''}"`
                  : 'No subcategory name was requested'}
              </span>
            </span>
            <Layers3 className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </Modal>

      <CreateCategoryModal
        type={createModalType || 'product'}
        isOpen={Boolean(createModalType)}
        onClose={closeCreateModal}
        onSuccess={handleCreateSuccess}
        initialValues={createModalInitialValues || undefined}
        productCategoryOptions={modalOptions.product || []}
        serviceCategoryOptions={modalOptions.service || []}
        foodCategoryOptions={modalOptions.food || []}
      />
    </div>
  );
}
