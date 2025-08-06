'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import type { ProductVariantPayload, ProductVariantSize } from '@/types/product';
import { uploadToS3 } from '@/utils/s3Uploader';

const defaultVariant: ProductVariantPayload = {
    color: '',
    label: 'Size',
    images: [],
    sizes: [{
        size: '',
        sku: '',
        stock: 0,
        price: 0,
        salePrice: undefined,
        discountEndDate: '',
    }],
    weightInKg: undefined,
    allowBackorder: false,
    isPublished: false,
    dimensions: {
        length: undefined,
        width: undefined,
        height: undefined,
    },
};

const AddVariantForm = () => {
    const router = useRouter();
    const { businessid, id: productId } = useParams();
    const [variant, setVariant] = useState<ProductVariantPayload>(defaultVariant);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: string, value: any) => {
        setVariant((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSizeChange = (
        index: number,
        field: keyof ProductVariantSize,
        value: ProductVariantSize[keyof ProductVariantSize]
    ) => {
        const updatedSizes = [...variant.sizes];
        updatedSizes[index] = { ...updatedSizes[index], [field]: value };
        setVariant(prev => ({ ...prev, sizes: updatedSizes }));
    };

    const handleAddSize = () => {
        const newSize = {
            size: '',
            sku: '',
            stock: 0,
            price: 0,
            salePrice: undefined,
            discountEndDate: '',
        };
        setVariant(prev => ({ ...prev, sizes: [...prev.sizes, newSize] }));
    };

    const handleRemoveSize = (index: number) => {
        const updatedSizes = variant.sizes.filter((_, i) => i !== index);
        setVariant(prev => ({ ...prev, sizes: updatedSizes }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setVariant(prev => ({ ...prev, images: [...prev.images, ...previews] }));
    };

    const resolveImageUpload = async (imageUrl: string, prefix = 'variant'): Promise<string> => {
        if (imageUrl.startsWith('blob:')) {
            const blob = await fetch(imageUrl).then((r) => r.blob());
            const fileObj = new File([blob], `${prefix}-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
            return await uploadToS3(fileObj);
        }
        return imageUrl;
    };

    const submitVariant = async (publish: boolean) => {
        setIsSubmitting(true);
        try {
            const uploadedImages = await Promise.all(
                variant.images.map((img: string) => resolveImageUpload(img, 'variant'))
            );

            const payload = {
                variants: [
                    { ...variant, images: uploadedImages, isPublished: publish }
                ]
            };

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/add-variants/${productId}`,
                payload,
                { withCredentials: true }
            );

            toast.success(publish ? 'Variant published successfully' : 'Draft saved successfully');
            router.back();
        } catch (error) {
            console.error('Add failed', error);
            toast.error('Failed to save variant');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold roboto">Add Variant</h1>

            <div className="flex flex-col-reverse gap-6 lg:flex-row">
                {/* Form */}
                <div className="flex-1 space-y-4">
                    <div className="p-5 space-y-4 bg-white rounded-md shadow">
                        <label htmlFor={`color-picker`} className="cursor-pointer">
                            Color:
                        </label>
                        <input
                            type="color"
                            value={variant.color || "#ffffff"}
                            id={`color-picker`}
                            onChange={(e) => handleChange("color", e.target.value)}
                            className="w-8 h-8 rounded-full"
                        />

                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Label (e.g., 'Summer Edition')"
                                value={variant.label || ''}
                                onChange={(e) => handleChange('label', e.target.value)}
                                className="w-full p-2 border rounded"
                            />

                            {variant.sizes.map((sizeObj: any, index: number) => (
                                <div key={index} className="grid grid-cols-2 gap-2 p-3 border rounded">
                                    <input
                                        type="text"
                                        placeholder={variant.label || ''}
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
                                        value={sizeObj.stock === 0 ? '' : sizeObj.stock}
                                        onChange={(e) => handleSizeChange(index, 'stock', parseInt(e.target.value))}
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={sizeObj.price === 0 ? '' : sizeObj.price}
                                        onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value))}
                                        required
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Sale Price"
                                        value={sizeObj.salePrice ?? ''}
                                        onChange={(e) => handleSizeChange(index, 'salePrice', parseFloat(e.target.value))}
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="date"
                                        value={sizeObj.discountEndDate ? sizeObj.discountEndDate.substring(0, 10) : ''}
                                        onChange={(e) => handleSizeChange(index, 'discountEndDate', e.target.value)}
                                        className="p-2 border rounded"
                                    />

                                    {/* Remove Size Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSize(index)}
                                        className="px-3 py-1 text-xs text-white bg-red-500 rounded"
                                    >
                                        Delete Size
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Size Button */}
                        <button
                            type="button"
                            onClick={handleAddSize}
                            className="px-4 py-2 text-white bg-blue-600 rounded"
                        >
                            + Add Size
                        </button>

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

                        {/* Dimensions */}
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

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => submitVariant(false)}
                            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save as Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={() => submitVariant(true)}
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish'}
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
        </div>
    );
};

export default AddVariantForm;
