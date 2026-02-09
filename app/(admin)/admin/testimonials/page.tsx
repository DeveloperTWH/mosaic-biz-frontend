'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { MessageSquare, PlusCircle, Pencil, Trash2, Star } from "lucide-react";
import TestimonialModal from './components/TestimonialModal';
import { getTestimonials, deleteTestimonial } from '@/lib/api/testimonials';
import { Testimonial } from '@/types/testimonial';

export default function TestimonialsPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
    const [editMode, setEditMode] = useState(false);

    const fetchTestimonials = async () => {
        try {
            const data = await getTestimonials();
            setTestimonials(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
            toast.error('Failed to fetch testimonials');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleDelete = async (testimonialId: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            await deleteTestimonial(testimonialId);
            toast.success("Testimonial deleted successfully");
            fetchTestimonials();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete testimonial");
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setEditMode(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedTestimonial(null);
        setEditMode(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setSelectedTestimonial(null);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setSidebarOpen} />

                <main className="flex-1 px-8 py-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-black heading flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-indigo-600" />
                            Testimonials
                        </h1>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Add Testimonial
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-gray-600">Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial._id} className="relative p-6 bg-white border rounded-lg shadow hover:shadow-md transition-shadow">
                                    {/* Action buttons */}
                                    <div className="absolute flex gap-2 top-4 right-4">
                                        <button
                                            onClick={() => handleEdit(testimonial)}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(testimonial._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Featured badge */}
                                    {testimonial.isFeatured && (
                                        <div className="absolute top-4 left-4">
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">
                                                Featured
                                            </span>
                                        </div>
                                    )}

                                    {/* Profile image */}
                                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 overflow-hidden bg-gray-100 rounded-full">
                                        <img 
                                            src={testimonial.image} 
                                            alt={testimonial.name} 
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    {/* Name and role */}
                                    <div className="text-center mb-3">
                                        <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex justify-center mb-3">
                                        {renderStars(testimonial.rating)}
                                    </div>

                                    {/* Content */}
                                    <p className="text-sm text-gray-700 text-center line-clamp-3">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Date */}
                                    <div className="mt-4 text-xs text-gray-500 text-center">
                                        Created: {new Date(testimonial.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && testimonials.length === 0 && (
                        <div className="text-center py-12">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No testimonials found. Add your first testimonial!</p>
                        </div>
                    )}
                </main>
            </div>

            <TestimonialModal
                isOpen={showModal}
                onClose={closeModal}
                onSuccess={fetchTestimonials}
                editMode={editMode}
                selectedTestimonial={selectedTestimonial}
            />
        </div>
    );
}