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






    const router = useRouter();


    const toggleExpand = (id: string) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

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
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/service/delete/${deleteTarget}`, {
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

        {/* code here */}

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