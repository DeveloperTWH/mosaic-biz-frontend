'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import type { ProductPayload } from '@/types/product';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { uploadToS3 } from '@/utils/s3Uploader';


const EditProductPage = () => {
    const router = useRouter();
    const { id: productid } = useParams();

    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [subcategories, setSubcategories] = useState<{ _id: string; name: string }[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [initialData, setInitialData] = useState<ProductPayload | null>(null);

    const [productData, setProductData] = useState<ProductPayload>({
        title: '',
        description: '',
        brand: '',
        categoryId: '',
        subcategoryId: '',
        businessId: '',
        coverImage: '',
        variantOptions: {},
        specifications: [],
        isPublished: false,
    });

    useEffect(() => {
        if (!productid) return;

        const loadAll = async () => {
            try {
                // 1. Load product
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${productid}`, {
                    withCredentials: true,
                });
                const product = res.data.data;
                console.log(res.data.data);
                setProductData(product);
                setInitialData(product);
                
                // 2. Load categories and subcategories (based on product.categoryId)
                const [catRes, subRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getProductCategories`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subcategories/${product.categoryId}`),
                ]);

                console.log(catRes.data.data.productCategories)
                setCategories(catRes.data.data.productCategories || []);
                setSubcategories(subRes.data.data || []);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAll();
    }, [productid]);



    const handleChange = (field: keyof ProductPayload, value: string | boolean) => {
        setProductData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSpecChange = (index: number, key: 'key' | 'value', value: string) => {
        const specs = [...(productData.specifications || [])];
        specs[index] = { ...specs[index], [key]: value }; // ✅ immutability fix
        setProductData((prev) => ({ ...prev, specifications: specs }));
    };


    const addSpecification = () => {
        setProductData((prev) => ({
            ...prev,
            specifications: [...(prev.specifications || []), { key: '', value: '' }],
        }));
    };

    const handleCategoryChange = async (value: string) => {
        handleChange('categoryId', value);
        setIsSubmitting(true);
        try {
            const subRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subcategories/${value}`);
            setSubcategories(subRes.data.data || []);
        } catch (error) {
            console.error('Error loading subcategories:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const removeSpecification = (index: number) => {
        const specs = [...(productData.specifications || [])];
        specs.splice(index, 1);
        setProductData((prev) => ({ ...prev, specifications: specs }));
    };

    const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const tempUrl = URL.createObjectURL(file);
        setProductData((prev) => ({ ...prev, coverImage: tempUrl }));
    };

    const submitProduct = async () => {
        if (!productid) return;
        setIsSubmitting(true);
        try {
            let coverImageUrl = productData.coverImage;

            // 🖼️ Upload to S3 if it's a blob URL
            if (coverImageUrl.startsWith("blob:")) {
                const blob = await fetch(coverImageUrl).then((r) => r.blob());
                const fileObj = new File([blob], `cover-${Date.now()}.jpg`, {
                    type: blob.type || "image/jpeg",
                });
                coverImageUrl = await uploadToS3(fileObj); // make sure you have this function
            }

            const updatedPayload = {
                ...productData,
                coverImage: coverImageUrl,
            };
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${productid}`,
                updatedPayload,
                { withCredentials: true }
            );
            setInitialData(productData);
            toast.success('Product updated successfully');
            router.back();
        } catch (error) {
            console.error('Failed to update product', error);
            toast.error('❌ Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasChanges = JSON.stringify(productData) !== JSON.stringify(initialData);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="text-lg font-medium text-gray-700">Loading product...</div>
            </div>
        );
    }


    return (
        <>
            <div className="space-y-6">
                <h1 className="text-xl font-semibold roboto">Update Product</h1>

                {/* Publish Toggle */}
                <div className="flex items-center gap-4">
                    <label className="font-medium">Publish Status:</label>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={productData.isPublished}
                            onChange={() => {
                                setShowPublishModal(true); // always show popup now
                            }}
                            className="sr-only peer"
                        />

                        <div className="relative h-6 bg-gray-200 rounded-full w-11 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 peer peer-checked:bg-green-500">
                            <div className="absolute w-4 h-4 transition bg-white rounded-full left-1 top-1 peer-checked:translate-x-5" />
                        </div>
                        <span className="ml-3 text-sm text-gray-700">
                            {productData.isPublished ? 'Published' : 'Unpublished'}
                        </span>
                    </label>
                </div>

                <div className="flex flex-col-reverse gap-6 lg:flex-row">
                    {/* Form */}
                    <div className="flex-1 space-y-4">
                        <div className="p-5 space-y-4 bg-white rounded-md shadow">
                            <input
                                type="text"
                                placeholder="Product Title"
                                value={productData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-2 border rounded"
                            />

                            <textarea
                                placeholder="Description"
                                value={productData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="w-full p-2 border rounded"
                            />

                            <input
                                type="text"
                                placeholder="Brand (Optional)"
                                value={productData.brand || ''}
                                onChange={(e) => handleChange('brand', e.target.value)}
                                className="w-full p-2 border rounded"
                            />

                            <select
                                className="w-full p-2 border rounded"
                                value={productData.categoryId}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="w-full p-2 border rounded"
                                value={productData.subcategoryId}
                                onChange={(e) => handleChange('subcategoryId', e.target.value)}
                            >
                                <option value="">Select Subcategory</option>
                                {subcategories.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>


                            {/* Specifications */}
                            <div className="space-y-2">
                                <label className="font-medium">Specifications</label>

                                {(productData.specifications ?? []).length === 0 ? (
                                    <div className="p-3 text-sm text-gray-500 bg-gray-100 rounded">
                                        No specifications added yet.
                                    </div>
                                ) : (
                                    (productData.specifications ?? []).map((spec, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Key"
                                                value={spec.key}
                                                onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                                                className="flex-1 p-2 border rounded"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                value={spec.value}
                                                onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                                                className="flex-1 p-2 border rounded"
                                            />
                                            <button
                                                onClick={() => removeSpecification(i)}
                                                className="px-2 text-white bg-red-500 rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}

                                <button
                                    onClick={addSpecification}
                                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
                                >
                                    + Add Specification
                                </button>
                            </div>

                        </div>

                        {/* Update Button */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={submitProduct}
                                className={`px-4 py-2 text-white rounded ${hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                disabled={!hasChanges || isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Product'}
                            </button>

                            <button
                                type="button"
                                onClick={() => initialData && setProductData(initialData)}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                                disabled={!hasChanges}
                            >
                                Reset Changes
                            </button>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="w-full space-y-4 lg:w-80">
                        <div className="p-4 bg-white rounded shadow">
                            <h2 className="pb-2 mb-2 text-base font-semibold border-b roboto">Cover Image</h2>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageUpload}
                                className="block w-full text-sm text-gray-500 border rounded"
                            />
                            {productData.coverImage && (
                                <div className="relative w-full mt-3">
                                    <img
                                        src={productData.coverImage}
                                        alt="Cover"
                                        className="object-cover w-full h-40 rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleChange('coverImage', '')}
                                        className="absolute px-1 text-xs text-white bg-red-500 rounded top-1 right-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Publish Confirmation Modal */}
                {showPublishModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
                            <h3 className="mb-2 text-lg font-semibold">Confirm {productData.isPublished ? 'Unpublish' : 'Publish'}</h3>
                            <p className="mb-4 text-sm text-gray-700">
                                {productData.isPublished
                                    ? 'Unpublishing this product will also unpublish all its variants. Are you sure?'
                                    : 'Publishing this product will also publish all its variants. Are you sure?'}
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowPublishModal(false)}
                                    className="px-4 py-1 text-sm text-gray-600 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        handleChange('isPublished', !productData.isPublished);
                                        setShowPublishModal(false);
                                    }}
                                    className={`px-4 py-1 text-sm text-white ${productData.isPublished ? 'bg-red-600' : 'bg-green-600'} rounded`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="px-4 py-2 text-white bg-gray-800 rounded">Loading...</div>
                </div>
            )}
        </>
    );
};

export default EditProductPage;
