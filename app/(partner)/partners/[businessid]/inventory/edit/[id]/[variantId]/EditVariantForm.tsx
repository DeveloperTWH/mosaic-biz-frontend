'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { ProductVariantPayload, ProductVariantSize } from '@/types/product';
import { uploadToS3 } from '@/utils/s3Uploader';

interface EditVariantFormProps {
    productId: string;
    variantId: string;
    onSuccess?: () => void;
}

const EditVariantForm: React.FC<EditVariantFormProps> = ({ productId, variantId, onSuccess }) => {
    const router = useRouter();

    const [variant, setVariant] = useState<ProductVariantPayload | null>(null);
    const [initialData, setInitialData] = useState<ProductVariantPayload | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [pendingPublishStatus, setPendingPublishStatus] = useState<boolean | null>(null);


    useEffect(() => {
        const loadVariant = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/get-variant/${productId}/${variantId}`,
                    { withCredentials: true }
                );
                setVariant(res.data.variant);
                setInitialData(res.data.variant);
            } catch (error) {
                console.error('Failed to load variant', error);
                toast.error('Failed to load variant');
            } finally {
                setIsLoading(false);
            }
        };

        loadVariant();
    }, [productId, variantId]);

    const handleChange = (field: string, value: any) => {
        setVariant((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSizeChange = (
        index: number,
        field: keyof ProductVariantSize,
        value: ProductVariantSize[keyof ProductVariantSize]
    ) => {
        if (!variant) return;

        const updatedSizes = [...variant.sizes];
        updatedSizes[index] = { ...updatedSizes[index], [field]: value };

        setVariant(prev => prev ? { ...prev, sizes: updatedSizes } : prev);
    };
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setVariant(prev => prev ? { ...prev, images: [...prev.images, ...previews] } : prev);
    };


    const resolveImageUpload = async (imageUrl: string, prefix = 'variant'): Promise<string> => {
        if (imageUrl.startsWith('blob:')) {
            const blob = await fetch(imageUrl).then((r) => r.blob());
            const fileObj = new File([blob], `${prefix}-${Date.now()}.jpg`, {
                type: blob.type || 'image/jpeg',
            });
            return await uploadToS3(fileObj); // assumes you already have this method
        }
        return imageUrl;
    };


    const submitVariant = async () => {
        if (!variant) return;
        setIsSubmitting(true);
        try {
            // upload all images if needed
            const uploadedImages = await Promise.all(
                variant.images.map((img: string) => resolveImageUpload(img, 'variant'))
            );

            const updatedPayload = {
                ...variant,
                images: uploadedImages,
            };

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/update-variant/${productId}/${variantId}`,
                updatedPayload,
                { withCredentials: true }
            );

            toast.success('Variant updated successfully');
            onSuccess ? onSuccess() : router.back();
        } catch (error) {
            console.error('Update failed', error);
            toast.error('❌ Failed to update variant');
        } finally {
            setIsSubmitting(false);
        }
    };


    const hasChanges = JSON.stringify(variant) !== JSON.stringify(initialData);

    if (isLoading || !variant) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="text-lg font-medium text-gray-700">Loading variant...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold roboto">Update Variant</h1>

            <div className="flex flex-col-reverse gap-6 lg:flex-row">
                {/* Form */}
                <div className="flex-1 space-y-4">

                    <div className="flex items-center gap-4">
                        <label className="font-medium">Publish Status:</label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={variant.isPublished}
                                onChange={() => {
                                    setPendingPublishStatus(!variant.isPublished); // store desired value
                                    setShowPublishModal(true); // trigger modal
                                }}
                                className="sr-only peer"
                            />
                            <div className="relative h-6 bg-gray-200 rounded-full w-11 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 peer peer-checked:bg-green-500">
                                <div className="absolute w-4 h-4 transition bg-white rounded-full left-1 top-1 peer-checked:translate-x-5" />
                            </div>
                            <span className="ml-3 text-sm text-gray-700">
                                {variant.isPublished ? 'Published' : 'Unpublished'}
                            </span>
                        </label>
                    </div>


                    <div className="p-5 space-y-4 bg-white rounded-md shadow">

                        <input
                            type="text"
                            placeholder="Color"
                            value={variant.color || ''}
                            required
                            onChange={(e) => handleChange('color', e.target.value)}
                            className="w-full p-2 border rounded"
                        />

                        <div className="space-y-2">
                            <label className="font-medium">Sizes</label>
                            {variant.sizes.map((sizeObj: any, index: number) => (
                                <div key={index} className="grid grid-cols-2 gap-2 p-3 border rounded">
                                    <input
                                        type="text"
                                        placeholder="Size"
                                        value={sizeObj.size}
                                        required
                                        onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="text"
                                        placeholder="SKU"
                                        value={sizeObj.sku}
                                        required
                                        onChange={(e) => handleSizeChange(index, 'sku', e.target.value)}
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={isNaN(sizeObj.stock) ? '' : sizeObj.stock}
                                        onChange={(e) => handleSizeChange(index, 'stock', parseInt(e.target.value))}
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={isNaN(sizeObj.price) ? '' : sizeObj.price}
                                        onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value))}
                                        required
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Sale Price"
                                        value={isNaN(sizeObj.salePrice) ? '' : sizeObj.salePrice}
                                        onChange={(e) => handleSizeChange(index, 'salePrice', parseFloat(e.target.value))}
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="date"
                                        value={sizeObj.discountEndDate ? sizeObj.discountEndDate.substring(0, 10) : ''}
                                        onChange={(e) => handleSizeChange(index, 'discountEndDate', e.target.value)}
                                        className="p-2 border rounded"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <input
                                type="number"
                                placeholder="Weight (kg)"
                                value={variant.weightInKg || ''}
                                onChange={(e) => handleChange('weightInKg', parseFloat(e.target.value))}
                                className="w-full p-2 border rounded"
                            />
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="checkbox"
                                    checked={variant.allowBackorder}
                                    onChange={(e) => handleChange('allowBackorder', e.target.checked)}
                                />
                                Allow Backorder
                            </label>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="number"
                                placeholder="Length (cm)"
                                value={variant.dimensions?.length || ''}
                                onChange={(e) => handleChange('dimensions', { ...variant.dimensions, length: parseFloat(e.target.value) })}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Width (cm)"
                                value={variant.dimensions?.width || ''}
                                onChange={(e) => handleChange('dimensions', { ...variant.dimensions, width: parseFloat(e.target.value) })}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Height (cm)"
                                value={variant.dimensions?.height || ''}
                                onChange={(e) => handleChange('dimensions', { ...variant.dimensions, height: parseFloat(e.target.value) })}
                                className="p-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={submitVariant}
                            className={`px-4 py-2 text-white rounded ${hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                            disabled={!hasChanges || isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Variant'}
                        </button>

                        <button
                            type="button"
                            onClick={() => initialData && setVariant(initialData)}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={!hasChanges}
                        >
                            Reset Changes
                        </button>
                    </div>
                </div>

                {/* Image */}
                <div className="w-full space-y-4 lg:w-80">
                    <div className="p-4 bg-white rounded shadow">
                        <h2 className="pb-2 mb-2 text-base font-semibold border-b roboto">Variant Image</h2>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-500 border rounded"
                        />
                        {variant.images?.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                {variant.images.map((img, idx) => (
                                    <div key={idx} className="relative w-full">
                                        <img src={img} alt={`Variant ${idx}`} className="object-cover w-full h-32 rounded" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const filtered = variant.images.filter((_, i) => i !== idx);
                                                handleChange('images', filtered);
                                            }}
                                            className="absolute px-1 text-xs text-white bg-red-500 rounded top-1 right-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {showPublishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="w-full max-w-sm p-6 bg-white rounded shadow">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {pendingPublishStatus ? 'Publish this variant?' : 'Unpublish this variant?'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            This will {pendingPublishStatus ? 'make it visible to users.' : 'hide it from users.'}
                        </p>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setVariant((prev) =>
                                        prev ? { ...prev, isPublished: !!pendingPublishStatus } : prev
                                    );

                                    setShowPublishModal(false);
                                }}
                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                Yes, {pendingPublishStatus ? 'Publish' : 'Unpublish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EditVariantForm;
