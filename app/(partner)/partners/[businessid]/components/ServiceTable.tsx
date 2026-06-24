'use client';

import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Upload, Download } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import DashboardEmptyState from '@/components/ui/dashboard-empty-state';
import {
    DashboardPagination,
    DashboardStatusPill,
    type DashboardTone,
} from '@/components/ui/dashboard-primitives';
import { Service } from '@/types/service';
import { ApiClientError, getUserSafeMessage } from '@/lib/api/errors';
import {
    canShowPublicListingLink,
    deleteService,
    extractFieldErrorsFromError,
    getInventoryStatus,
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
    type ServiceInventoryStatus,
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

    const getStatusTone = (status: ServiceInventoryStatus): DashboardTone => {
        if (status === "published") return "success";
        if (status === "draft") return "warning";
        if (status === "publication_failed") return "danger";
        return "neutral";
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
                    <Link
                        href={getPublicServiceUrl(service._id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dashboard-action dashboard-action--ghost min-h-10 px-3 py-1"
                    >
                        <Eye size={14} />
                        View public
                    </Link>
                ) : null}

                {status === 'draft' ? (
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => runPublicationAction(service._id, true)}
                        className="dashboard-action dashboard-action--secondary min-h-10 px-3 py-1"
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
                        className="dashboard-action dashboard-action--danger min-h-10 px-3 py-1"
                    >
                        <Download size={14} />
                        Unpublish
                    </button>
                ) : null}

                <Link href={`/partners/${businessid}/inventory/edit-service/${service._id}`}>
                    <button type="button" className="dashboard-icon-button dashboard-icon-button--warning">
                        <Pencil size={16} />
                        <span className="sr-only">Edit service</span>
                    </button>
                </Link>

                <button
                    type="button"
                    className="dashboard-icon-button dashboard-icon-button--danger"
                    onClick={() => {
                        setDeleteTarget(service._id);
                        setShowDeleteModal(true);
                    }}
                    aria-label="Delete service"
                    title="Delete service"
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
                <DashboardStatusPill tone={getStatusTone(status)}>
                    {getInventoryStatusLabel(status)}
                </DashboardStatusPill>
                {detail ? (
                    <p className="max-w-xs font-montserrat text-xs text-dashboard-warn-text" title={detail}>
                        {detail}
                    </p>
                ) : null}
            </div>
        );
    };

    if (services.length === 0) {
        return (
            <DashboardEmptyState
                title="No services yet"
                description="Add your first service to start accepting bookings."
                ctaLabel="Add service"
                ctaHref={`/partners/${businessid}/inventory/add-service`}
            />
        );
    }

    return (
        <div className="dashboard-table-shell">
            <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-sm">
                    <thead>
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
                            <tr key={service._id} className="border-t border-dashboard-border-light hover:bg-surface-cream">
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
                                            <p className="font-medium text-dashboard-text">{service.title}</p>
                                            <p className="text-xs text-dashboard-muted">{service.slug}</p>
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
                    <div key={service._id} className="dashboard-mobile-card space-y-3">
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
                                <p className="font-medium text-dashboard-text">{service.title}</p>
                                <p className="text-xs text-dashboard-muted">{service.slug}</p>
                            </div>
                        </div>
                        <p className="text-sm"><strong>Rating:</strong> {service.averageRating?.toFixed(1) || 'N/A'}</p>
                        <p className="text-sm"><strong>Address:</strong> {service.contact?.address || 'N/A'}</p>
                        <p className="text-sm"><strong>Status:</strong> {renderStatusBadge(service)}</p>
                        {renderActions(service)}
                    </div>
                ))}
            </div>

            <DashboardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

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
