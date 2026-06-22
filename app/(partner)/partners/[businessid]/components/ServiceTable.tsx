'use client';

import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Upload, Download } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { Service } from '@/types/service';
import { ApiClientError, getUserSafeMessage } from '@/lib/api/errors';
import {
    canShowPublicListingLink,
    deleteService,
    extractFieldErrorsFromError,
    getInventoryStatus,
    getInventoryStatusClass,
    getInventoryStatusDetail,
    getInventoryStatusLabel,
    getPublicationSuccessMessage,
    getPublicServiceUrl,
    getServiceById,
    mapServiceToFormState,
    serializeServicePayload,
    updateService,
    validateServiceForPublish,
    verifyPublicListing,
} from '@/lib/api/services';


interface ServiceTableProps {
    services: Service[];
    businessId: string;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onServicesChanged: () => void;
    isLoading?: boolean;
    error?: string | null;
}


const ServiceTable: React.FC<ServiceTableProps> = ({
    services,
    businessId,
    currentPage,
    totalPages,
    onPageChange,
    onServicesChanged,
    isLoading,
    error,
}) => {
    const { businessid } = useParams();
    const [expanded, setExpanded] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string>('');
    const [actionServiceId, setActionServiceId] = useState<string | null>(null);

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) onPageChange(page);
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => changePage(i)}
                    className={`px-3 py-1 border rounded ${currentPage === i
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-end gap-2 mt-4">
                <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-black bg-white border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                {pages}
                <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-black bg-white border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        );
    };

    const handleDelete = async () => {
        try {
            await deleteService(deleteTarget);
            toast.success('Service deleted successfully');
            onServicesChanged();
        } catch (err) {
            toast.error(getUserSafeMessage(err, 'Delete failed'));
        } finally {
            setShowDeleteModal(false);
        }
    };

    const runPublicationAction = async (serviceId: string, publish: boolean) => {
        setActionServiceId(serviceId);
        try {
            const service = await getServiceById(serviceId);
            const form = mapServiceToFormState(service);

            if (publish) {
                const errors = validateServiceForPublish(form);
                if (Object.keys(errors).length > 0) {
                    toast.error('Complete service options (name, price, duration) before publishing.');
                    return;
                }
            }

            const payload = serializeServicePayload(form, { businessId, publish });
            const result = await updateService(serviceId, payload);

            let publicVisible: boolean | undefined;
            if (publish) {
                publicVisible = (await verifyPublicListing(serviceId)).visible;
            }

            const message = getPublicationSuccessMessage(result, { publish, publicVisible });
            toast.success(message.toast);
            if (message.detail) toast.info(message.detail);
            onServicesChanged();
        } catch (err) {
            if (err instanceof ApiClientError && err.status === 409) {
                toast.error(err.message || 'A service already exists for this business.');
                return;
            }
            const fieldErrors = extractFieldErrorsFromError(err);
            if (Object.keys(fieldErrors).length > 0) {
                toast.error(Object.values(fieldErrors)[0]);
                return;
            }
            toast.error(getUserSafeMessage(err, publish ? 'Publication failed.' : 'Unpublish failed.'));
        } finally {
            setActionServiceId(null);
        }
    };

    const renderActions = (service: Service) => {
        const status = getInventoryStatus(service);
        const busy = actionServiceId === service._id;

        return (
            <div className="flex flex-wrap justify-end gap-2">
                {canShowPublicListingLink(service) ? (
                    <Link href={getPublicServiceUrl(service._id)} target="_blank" rel="noopener noreferrer">
                        <button
                            type="button"
                            className="inline-flex min-h-11 items-center gap-1 rounded border border-blue-200 px-2 py-1 text-xs text-blue-700"
                            title="View Public Listing"
                        >
                            <Eye size={14} />
                            View Public
                        </button>
                    </Link>
                ) : null}

                {status === 'draft' ? (
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => runPublicationAction(service._id, true)}
                        className="inline-flex min-h-11 items-center gap-1 rounded bg-green-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                    >
                        <Upload size={14} />
                        Publish
                    </button>
                ) : null}

                {service.isPublished ? (
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => runPublicationAction(service._id, false)}
                        className="inline-flex min-h-11 items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                    >
                        <Download size={14} />
                        Unpublish
                    </button>
                ) : null}

                <Link href={`/partners/${businessid}/inventory/edit-service/${service._id}`}>
                    <button type="button" className="inline-flex min-h-11 items-center rounded p-2 text-green-600 hover:text-green-800">
                        <Pencil size={16} />
                    </button>
                </Link>

                <button
                    type="button"
                    className="inline-flex min-h-11 items-center rounded p-2 text-red-600 hover:text-red-800"
                    onClick={() => {
                        setDeleteTarget(service._id);
                        setShowDeleteModal(true);
                    }}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        );
    };

    const renderStatusBadge = (service: Service) => {
        const status = getInventoryStatus(service);
        const detail = getInventoryStatusDetail(service);

        return (
            <div className="space-y-1">
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getInventoryStatusClass(status)}`}>
                    {getInventoryStatusLabel(status)}
                </span>
                {detail ? (
                    <p className="max-w-xs text-xs text-amber-800" title={detail}>
                        {detail}
                    </p>
                ) : null}
            </div>
        );
    };

    if (services.length === 0) {
        return (
            <div className="p-6 text-center bg-white border rounded shadow-sm">
                <p className="mb-4 text-gray-700 text-md">No services found for this business.</p>
                <Link href={`/partners/${businessid}/inventory/add-service`}>
                    <button className="min-h-11 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                        + Add Service
                    </button>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <div className="hidden overflow-x-auto bg-white border rounded shadow-sm md:block">
                <table className="min-w-full text-sm">
                    <thead className="text-left bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">Service</th>
                            <th className="px-4 py-3">Rating</th>
                            <th className="px-4 py-3">Address</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service._id} className="border-t">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 overflow-hidden border rounded">
                                            <Image
                                                src={service.coverImage}
                                                alt={service.title}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{service.title}</p>
                                            <p className="text-xs text-gray-500">{service.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{service.averageRating?.toFixed(1) || 'N/A'}</td>
                                <td className="px-4 py-3">{service.contact?.address || 'N/A'}</td>
                                <td className="px-4 py-3">{renderStatusBadge(service)}</td>
                                <td className="px-4 py-3">{renderActions(service)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="block space-y-4 md:hidden">
                {services.map(service => (
                    <div key={service._id} className="p-4 space-y-3 bg-white border rounded shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 min-w-[64px] overflow-hidden border rounded">
                                <Image
                                    src={service.coverImage}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                            <div>
                                <p className="font-medium">{service.title}</p>
                                <p className="text-xs text-gray-500">{service.slug}</p>
                            </div>
                        </div>
                        <p className="text-sm"><strong>Rating:</strong> {service.averageRating?.toFixed(1) || 'N/A'}</p>
                        <p className="text-sm"><strong>Address:</strong> {service.contact?.address || 'N/A'}</p>
                        <p className="text-sm"><strong>Status:</strong> {renderStatusBadge(service)}</p>
                        {renderActions(service)}
                    </div>
                ))}
            </div>

            {renderPagination()}

            {showDeleteModal && (
                <DeleteConfirmationModal
                    message="Are you sure you want to delete this service? This action cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default ServiceTable;
