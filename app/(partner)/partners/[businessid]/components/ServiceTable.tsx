'use client';

import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useBusinessStore } from '@/app/store/businessStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { Service } from '@/types/service';


interface ServiceTableProps {
    services: Service[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    error?: string | null;
}


const ServiceTable: React.FC<ServiceTableProps> = ({
    services,
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
    error,
}) => {
    const { businessid } = useParams();
    const { business } = useBusinessStore();
    const [expanded, setExpanded] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string>('');






    const router = useRouter();;

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
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/service/delete-service/${deleteTarget}`, {
                withCredentials: true,
            });
            toast.success('Service deleted successfully');
            changePage(currentPage);
        } catch (err) {
            toast.error('Delete failed');
        } finally {
            setShowDeleteModal(false);
        }
    };


    if (services.length === 0) {
        return (
            <div className="p-6 text-center bg-white border rounded shadow-sm">
                <p className="mb-4 text-gray-700 text-md">No services found for this business.</p>
                <Link href={`/partners/${businessid}/inventory/add-service`}>
                    <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                        + Add Service
                    </button>
                </Link>
            </div>
        )
    }

    return (
        <div className="p-4 bg-white rounded shadow md:p-6">
            <div className="flex flex-col items-start justify-between gap-3 mb-6 sm:flex-row sm:items-center">
                <h3 className="text-xl font-bold capitalize">{business?.listingType}</h3>
                <Link
                    href={`/partners/${businessid}/inventory/add-${business?.listingType}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded bg-custom-orange hover:opacity-90"
                >
                    <Plus className="w-4 h-4" /> Add {business?.listingType}
                </Link>
            </div>

            {/* ✅ Desktop Table */}
            <div className="hidden w-full overflow-x-auto md:block">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-[#333333] text-white">
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
                            <tr key={service._id} className="border-b hover:bg-gray-50">
                                <td className="flex items-center gap-3 px-4 py-3">
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] sm:min-w-[80px] overflow-hidden border rounded">
                                        <Image
                                            src={service.coverImage}
                                            alt={service.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 64px, 80px"
                                        />
                                    </div>

                                    <div>
                                        <p className="font-medium">{service.title}</p>
                                        <p className="text-xs text-gray-500">{service.slug}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{service.averageRating?.toFixed(1) || 'N/A'}</td>
                                <td className="px-4 py-3">{service.contact?.address || 'N/A'}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${service.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {service.isPublished ? 'Published' : 'Unpublished'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 space-x-2 text-right">
                                    {service.isPublished && (
                                        <Link href={`/service/${service.slug}`}>
                                            <button className="p-1 text-blue-600 hover:text-blue-800" title="View Public Page">
                                                <Eye size={16} />
                                            </button>
                                        </Link>
                                    )}

                                    <Link href={`/partners/${businessid}/inventory/edit-service/${service._id}`}>
                                        <button className="p-1 text-green-600 hover:text-green-800">
                                            <Pencil size={16} />
                                        </button>
                                    </Link>
                                    <button
                                        className="p-1 text-red-600 hover:text-red-800"
                                        onClick={() => {
                                            setDeleteTarget(service._id);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Mobile Card View */}
            <div className="block space-y-4 md:hidden">
                {services.map(service => (
                    <div key={service._id} className="p-4 space-y-2 bg-white border rounded shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] sm:min-w-[80px] overflow-hidden border rounded">
                                <Image
                                    src={service.coverImage}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 64px, 80px"
                                />
                            </div>

                            <div>
                                <p className="font-medium">{service.title}</p>
                                <p className="text-xs text-gray-500">{service.slug}</p>
                            </div>
                        </div>
                        <p className="text-sm"><strong>Rating:</strong> {service.averageRating?.toFixed(1) || 'N/A'}</p>
                        <p className="text-sm"><strong>Address:</strong> {service.contact?.address || 'N/A'}</p>
                        <p className="text-sm">
                            <strong>Status:</strong>{' '}
                            <span className={`px-2 py-1 text-xs rounded-full ${service.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {service.isPublished ? 'Published' : 'Unpublished'}
                            </span>
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            {service.isPublished && (
                                <Link href={`/service/${service.slug}`}>
                                    <button className="p-1 text-blue-600 hover:text-blue-800" title="View Public Page">
                                        <Eye size={16} />
                                    </button>
                                </Link>
                            )}
                            <Link href={`/partners/${businessid}/inventory/edit-service/${service._id}`}>
                                <button className="p-1 text-green-600 hover:text-green-800">
                                    <Pencil size={16} />
                                </button>
                            </Link>
                            <button
                                className="p-1 text-red-600 hover:text-red-800"
                                onClick={() => {
                                    setDeleteTarget(service._id);
                                    setShowDeleteModal(true);
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>



            {renderPagination()}

            {showDeleteModal && (
                <DeleteConfirmationModal
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Confirm Delete"
                    message={'Are you sure you want to delete this Service?'}
                />
            )}


        </div>
    )
}

export default ServiceTable