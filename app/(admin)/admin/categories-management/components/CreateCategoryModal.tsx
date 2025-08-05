'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { uploadToS3 } from '@/utils/s3Uploader';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    type: 'product' | 'service' | 'food' | 'product-subcategory';
    onSuccess?: () => void;
    productCategoryOptions?: { _id: string; name: string }[];
    editMode?: boolean;
    selectedCategory?: {
        _id: string;
        name: string;
        slug: string;
        description?: string;
        img?: string;
        categoryId?: string;
    } | null;
}


export default function CreateCategoryModal({
    isOpen,
    onClose,
    type,
    onSuccess,
    productCategoryOptions = [],
    editMode = false,
    selectedCategory = null,
}: Props) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editMode && selectedCategory) {
            setName(selectedCategory.name);
            setSlug(selectedCategory.slug);
            setDescription(selectedCategory.description || '');
            setParentCategoryId(selectedCategory.categoryId || '');
            setImagePreview(selectedCategory.img || '');
        } else {
            // Reset when modal opens in create mode
            setName('');
            setSlug('');
            setDescription('');
            setParentCategoryId('');
            setImageFile(null);
            setImagePreview('');
        }
    }, [editMode, selectedCategory, isOpen]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        setSlug(
            newName
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
        );
    };

    const handleSubmit = async () => {
        if (!name || !slug) {
            toast.error('Name and slug are required');
            return;
        }

        setLoading(true);

        try {
            let imageUrl = imagePreview;

            if ((type === 'product' || type === 'service') && imageFile) {
                imageUrl = await uploadToS3(imageFile);
            }

            const payload: any = {
                name,
                slug,
                description,
            };

            if (imageUrl) payload.img = imageUrl;
            if (type === 'product-subcategory') {
                if (!parentCategoryId) {
                    toast.error('Please select a parent category');
                    setLoading(false);
                    return;
                }
                payload.categoryId = parentCategoryId;
            }

            let endpoint = '';
            switch (type) {
                case 'product':
                    endpoint = '/api/admin/category/product';
                    break;
                case 'service':
                    endpoint = '/api/admin/category/service';
                    break;
                case 'food':
                    endpoint = '/api/admin/category/food';
                    break;
                case 'product-subcategory':
                    endpoint = '/api/admin/category/product-subcategory';
                    break;
            }

            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;
            if (editMode && selectedCategory?._id) {
                await axios.put(`${url}/${selectedCategory._id}`, payload, {
                    withCredentials: true,
                });
                toast.success('Category updated successfully');
            } else {
                await axios.post(url, payload, { withCredentials: true });
                toast.success('Category created successfully');
            }

            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit category');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="mb-4 text-lg font-semibold">
                {type === 'product-subcategory'
                    ? 'Add Product Subcategory'
                    : `Add ${type.charAt(0).toUpperCase() + type.slice(1)} Category`}
            </h2>

            <div className="space-y-4">
                {type === 'product-subcategory' && (
                    <select
                        value={parentCategoryId}
                        onChange={(e) => setParentCategoryId(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    >
                        <option value="">Select Parent Category</option>
                        {productCategoryOptions.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2 border rounded"
                />

                <input
                    type="text"
                    placeholder="Slug"
                    value={slug}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border rounded cursor-not-allowed"
                />

                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                />

                {(type === 'product' || type === 'service') && (
                    <div className="space-y-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="object-contain w-full h-40 border rounded"
                            />
                        )}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? (editMode ? 'Updating...' : 'Creating...') : editMode ? 'Update' : 'Create'}
                </button>
            </div>
        </Modal>
    );
}
