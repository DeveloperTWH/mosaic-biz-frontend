'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Star } from 'lucide-react';
import { createTestimonial, updateTestimonial } from '@/lib/api/testimonials';
import { Testimonial } from '@/types/testimonial';

interface TestimonialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editMode?: boolean;
    selectedTestimonial?: Testimonial | null;
}

export default function TestimonialModal({
    isOpen,
    onClose,
    onSuccess,
    editMode = false,
    selectedTestimonial = null
}: TestimonialModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        content: '',
        image: '',
        rating: 5,
        isFeatured: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editMode && selectedTestimonial) {
            setFormData({
                name: selectedTestimonial.name,
                role: selectedTestimonial.role,
                content: selectedTestimonial.content,
                image: selectedTestimonial.image,
                rating: selectedTestimonial.rating,
                isFeatured: selectedTestimonial.isFeatured
            });
        } else {
            setFormData({
                name: '',
                role: '',
                content: '',
                image: '',
                rating: 5,
                isFeatured: false
            });
        }
    }, [editMode, selectedTestimonial, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editMode && selectedTestimonial) {
                await updateTestimonial(selectedTestimonial._id, formData);
                toast.success('Testimonial updated successfully');
            } else {
                await createTestimonial(formData);
                toast.success('Testimonial created successfully');
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to save testimonial');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {editMode ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role *
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content *
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL *
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating *
                        </label>
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleRatingChange(i + 1)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            i < formData.rating 
                                                ? 'text-yellow-400 fill-current' 
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                            Featured testimonial
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (editMode ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}