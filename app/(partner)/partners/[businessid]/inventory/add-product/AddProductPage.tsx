"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import {
    CreateProductWithVariantsPayload,
    ProductVariantPayload,
    ProductVariantSize,
} from "@/types/product";
import axios from "axios";
import { uploadToS3 } from "@/utils/s3Uploader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";



interface AddProductPageProps {
    businessId: string | undefined;
    businessSlug: string | undefined;
}

const AddProductPage: React.FC<AddProductPageProps> = ({ businessId, businessSlug }) => {
    const [productData, setProductData] = useState<CreateProductWithVariantsPayload>({
        title: "",
        description: "",
        brand: "",
        categoryId: "",
        subcategoryId: "",
        businessId: "",
        coverImage: "",
        variantOptions: {},
        specifications: [],
        isPublished: false,
        variants: [],
    });

    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [subcategories, setSubcategories] = useState<{ _id: string; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getProductCategories`
                );
                setCategories(res.data.data.productCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        addSpecification()
        addVariant();
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!productData.categoryId) return;
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subcategories/${productData.categoryId}`
                );
                setSubcategories(res.data.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };
        fetchSubcategories();
    }, [productData.categoryId]);

    const handleChange = <K extends keyof CreateProductWithVariantsPayload>(
        field: K,
        value: CreateProductWithVariantsPayload[K]
    ) => {
        setProductData((prev) => ({ ...prev, [field]: value }));
    };

    // ✅ Specification Handlers
    const addSpecification = () => {
        const updated = [...(productData.specifications || []), { key: "", value: "" }];
        handleChange("specifications", updated);
    };

    const updateSpecification = (index: number, field: "key" | "value", val: string) => {
        const updated = [...(productData.specifications || [])];
        updated[index][field] = val;
        handleChange("specifications", updated);
    };

    const removeSpecification = (index: number) => {
        const updated = [...(productData.specifications || [])];
        updated.splice(index, 1);
        handleChange("specifications", updated);
    };

    // ✅ Variant Handlers
    const addVariant = () => {
        const newVariant: ProductVariantPayload = {
            color: "",
            label: "Size",
            images: [],
            videos: [],
            allowBackorder: false,
            isPublished: false,
            weightInKg: undefined,
            dimensions: { length: undefined, width: undefined, height: undefined },
            sizes: [
                {
                    size: "",
                    stock: undefined,
                    price: undefined,
                    salePrice: undefined,
                    sku: "",
                    discountEndDate: "",
                },
            ],
        };
        handleChange("variants", [...productData.variants, newVariant]);
    };

    const removeVariant = (index: number) => {
        const updatedVariants = [...productData.variants];
        updatedVariants.splice(index, 1);
        handleChange("variants", updatedVariants);
    };

    const updateVariant = <K extends keyof ProductVariantPayload>(
        index: number,
        field: K,
        value: ProductVariantPayload[K]
    ) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        handleChange("variants", updatedVariants);
    };

    const addSizeToVariant = (variantIndex: number) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[variantIndex].sizes.push({
            size: "",
            stock: undefined,
            price: undefined,
            salePrice: undefined,
            sku: "",
            discountEndDate: "",
        });
        handleChange("variants", updatedVariants);
    };

    const updateVariantSize = (
        variantIndex: number,
        sizeIndex: number,
        field: keyof ProductVariantSize,
        value: ProductVariantSize[keyof ProductVariantSize]
    ) => {
        const updatedVariants = [...productData.variants];
        const updatedSizes = [...updatedVariants[variantIndex].sizes];
        updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], [field]: value };
        updatedVariants[variantIndex].sizes = updatedSizes;
        handleChange("variants", updatedVariants);
    };

    // ✅ Upload Handlers + Remove Logic
    const handleCoverImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        handleChange("coverImage", url);
    };

    const removeCoverImage = () => {
        handleChange("coverImage", "");
    };

    const handleVariantImageUpload = (variantIndex: number, e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const urls = Array.from(files).map((file) => URL.createObjectURL(file));
        const updatedVariants = [...productData.variants];
        updatedVariants[variantIndex].images.push(...urls);
        handleChange("variants", updatedVariants);
    };

    const removeVariantImage = (variantIndex: number, imageIndex: number) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[variantIndex].images.splice(imageIndex, 1);
        handleChange("variants", updatedVariants);
    };

    const handleVariantVideoUpload = (
        variantIndex: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files) return;
        const urls = Array.from(files).map((file) => URL.createObjectURL(file));
        const updatedVariants = [...productData.variants];

        if (!updatedVariants[variantIndex].videos) {
            updatedVariants[variantIndex].videos = [];
        }

        updatedVariants[variantIndex].videos.push(...urls);
        handleChange("variants", updatedVariants);
    };

    const removeVariantVideo = (variantIndex: number, videoIndex: number) => {
        const updatedVariants = [...productData.variants];

        if (!updatedVariants[variantIndex].videos) {
            updatedVariants[variantIndex].videos = [];
        }

        updatedVariants[variantIndex].videos.splice(videoIndex, 1);
        handleChange("variants", updatedVariants);
    };

    // ✅ Build variantOptions Before API
    const generateVariantOptions = () => {
        const variantOptions: Record<string, string[]> = {};
        productData.variants.forEach((variant) => {
            variantOptions[variant.color] = variant.sizes.map((s) => s.size);
        });
        return variantOptions;
    };

    // ✅ Validation: Ensure each variant has at least 1 image
    const validateBeforeSubmit = (): boolean => {
        if (productData.variants.length === 0) {
            toast.error("Please add at least one product variant.");
            return false;
        }

        for (const variant of productData.variants) {
            if (!variant.images || variant.images.length === 0) {
                toast.error(`Upload at least 1 image for variant color: ${variant.color || "Unnamed"}`);
                return false;
            }

            for (const size of variant.sizes || []) {
                const price = Number(size.price);
                const salePrice = Number(size.salePrice);

                if (salePrice && salePrice >= price) {
                    toast.error(
                        `Sale price should be less than actual price for SKU: ${size.sku} (Color: ${variant.color || "Unnamed"})`
                    );
                    return false;
                }
            }
        }

        return true;
    };

    // ✅ Single Submit Function for Logging & Later API
    // ✅ Single Submit Function for Logging & Later API

    const submitProduct = async (isPublished: boolean) => {
        if (!validateBeforeSubmit()) return;

        if (!businessId) {
            alert("Business ID is missing.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Uploading files to S3...");

            // ✅ 1. Upload Cover Image (with proper MIME type)
            let coverImageUrl = productData.coverImage;
            if (coverImageUrl.startsWith("blob:")) {
                const blob = await fetch(coverImageUrl).then((r) => r.blob());
                const fileObj = new File([blob], `cover-${Date.now()}.jpg`, {
                    type: blob.type || "image/jpeg",
                });
                coverImageUrl = await uploadToS3(fileObj);
            }

            // ✅ 2. Upload Variant Images & Videos (with proper MIME types)
            const updatedVariants = await Promise.all(
                productData.variants.map(async (variant, vIndex) => {
                    // --- Images ---
                    const uploadedImages = await Promise.all(
                        variant.images.map(async (imgUrl, i) => {
                            if (imgUrl.startsWith("blob:")) {
                                const blob = await fetch(imgUrl).then((r) => r.blob());
                                const fileObj = new File(
                                    [blob],
                                    `variant-${vIndex}-img-${Date.now()}-${i}.jpg`,
                                    { type: blob.type || "image/jpeg" }
                                );
                                return await uploadToS3(fileObj);
                            }
                            return imgUrl;
                        })
                    );

                    // --- Videos ---
                    const uploadedVideos = await Promise.all(
                        (variant.videos || []).map(async (vidUrl, i) => {
                            if (vidUrl.startsWith("blob:")) {
                                const blob = await fetch(vidUrl).then((r) => r.blob());
                                const fileObj = new File(
                                    [blob],
                                    `variant-${vIndex}-vid-${Date.now()}-${i}.mp4`,
                                    { type: blob.type || "video/mp4" }
                                );
                                return await uploadToS3(fileObj);
                            }
                            return vidUrl;
                        })
                    );

                    return {
                        ...variant,
                        images: uploadedImages,
                        videos: uploadedVideos,
                        isPublished: isPublished, // ✅ Ensure correct publish state
                    };
                })
            );

            // ✅ 3. Build Final Payload
            const payload: CreateProductWithVariantsPayload = {
                ...productData,
                businessId: businessId, // ✅ Inject businessId
                coverImage: coverImageUrl,
                isPublished: isPublished,
                variants: updatedVariants,
                variantOptions: generateVariantOptions(),
            };

            console.log(
                isPublished ? "Publishing Product..." : "Saving Draft...",
                payload
            );

            // ✅ 4. API Call
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/`,
                payload,
                { withCredentials: true }
            );

            toast.success(isPublished ? "✅ Product Published!" : "✅ Draft Saved!");
            router.push(`/partners/${businessSlug}/inventory`);
        } catch (error) {
            console.error("Error submitting product:", error);
            toast.error("Failed to submit product.");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Left Section (Product & Variants) */}
            <div className="flex-1 space-y-6">
                <h1 className="text-xl font-semibold roboto">Add New Product</h1>
                <div className="p-5 space-y-4 bg-white rounded-md shadow">
                    <h2 className="pb-2 text-base font-semibold border-b roboto">Product Details</h2>
                    <input
                        type="text"
                        placeholder="Product Title"
                        value={productData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        placeholder="Description"
                        value={productData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Brand (Optional)"
                        value={productData.brand || ""}
                        onChange={(e) => handleChange("brand", e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <select
                        value={productData.categoryId}
                        onChange={(e) => handleChange("categoryId", e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={productData.subcategoryId}
                        onChange={(e) => handleChange("subcategoryId", e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>

                    {/* Specifications */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-md">Specifications</h3>
                            <button
                                type="button"
                                onClick={addSpecification}
                                className="px-2 py-1 text-sm text-white bg-blue-600 rounded"
                            >
                                + Add Specification
                            </button>
                        </div>
                        {productData.specifications?.map((spec, i) => (
                            <div key={i} className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Key"
                                    value={spec.key}
                                    onChange={(e) => updateSpecification(i, "key", e.target.value)}
                                    className="flex-1 p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={spec.value}
                                    onChange={(e) => updateSpecification(i, "value", e.target.value)}
                                    className="flex-1 p-2 border rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpecification(i)}
                                    className="px-2 text-xs text-white bg-red-500 rounded"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ✅ Cover Image (Mobile View directly after product details) */}
                    <div className="p-5 bg-white rounded-md shadow lg:hidden">
                        <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Cover Image</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageUpload}
                            className="block w-full text-sm text-gray-500 border rounded"
                        />
                        {productData.coverImage && (
                            <div className="relative w-40 mt-2">
                                <img
                                    src={productData.coverImage}
                                    alt="Cover"
                                    className="object-cover w-40 h-40 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={removeCoverImage}
                                    className="absolute px-1 text-xs text-white bg-red-500 rounded top-1 right-1"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Variants */}
                <div className="p-5 space-y-4 bg-white rounded-md shadow">
                    <h1 className="text-base font-semibold roboto">Product Variantions</h1>
                    {productData.variants.map((variant, vIndex) => (
                        <div
                            key={vIndex}
                            className="p-4 mb-4 space-y-3 border border-gray-300 rounded"
                        >
                            <div className="flex items-center gap-2">
                                {/* Color Picker */}
                                <label htmlFor={`color-picker-${vIndex}`} className="cursor-pointer">
                                    Color :
                                </label>
                                <input
                                    type="color"
                                    value={variant.color || "#ffffff"}  // Default color is white if there's no color selected
                                    id={`color-picker-${vIndex}`}
                                    onChange={(e) => updateVariant(vIndex, "color", e.target.value)}
                                    className="w-8 h-8 rounded-full"
                                    title="Pick a color"  // Tooltip when hovering over the color input
                                />

                                {/* Hex Code Input */}
                                <input
                                    type="text"
                                    value={variant.color || ""}  // Default color is white if there's no color selected
                                    onChange={(e) => updateVariant(vIndex, "color", e.target.value)}
                                    className="w-24 p-2 border rounded"
                                    placeholder="Enter Hex"
                                    title="Enter a hex color code"
                                />
                            </div>


                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={variant.allowBackorder || false}
                                    onChange={(e) =>
                                        updateVariant(vIndex, "allowBackorder", e.target.checked)
                                    }
                                />
                                Allow Backorder
                            </label>

                            {/* Sizes */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <input
                                        type="text"
                                        value={variant.label ?? "Size"}
                                        onChange={(e) => updateVariant(vIndex, "label", e.target.value)}
                                        placeholder="Label (e.g., Size, Quantity, Edition)"
                                        className="p-2 text-sm border rounded w-[70%]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addSizeToVariant(vIndex)}
                                        className="text-sm text-blue-600"
                                    >
                                        + Add {variant.label || "Size"}
                                    </button>
                                </div>

                                {variant.sizes.map((size, sIndex) => (
                                    <div key={sIndex} className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                                        <input
                                            type="text"
                                            placeholder={variant.label || "Size"}
                                            value={size.size}
                                            onChange={(e) =>
                                                updateVariantSize(vIndex, sIndex, "size", e.target.value)
                                            }
                                            className="p-2 border rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Stock"
                                            value={size.stock || ""}
                                            onChange={(e) =>
                                                updateVariantSize(vIndex, sIndex, "stock", Number(e.target.value))
                                            }
                                            className="p-2 border rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Price"
                                            value={size.price || ""}
                                            onChange={(e) =>
                                                updateVariantSize(vIndex, sIndex, "price", Number(e.target.value))
                                            }
                                            className="p-2 border rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Sale Price"
                                            value={size.salePrice || ""}
                                            onChange={(e) =>
                                                updateVariantSize(vIndex, sIndex, "salePrice", Number(e.target.value))
                                            }
                                            className="p-2 border rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="SKU"
                                            value={size.sku}
                                            onChange={(e) =>
                                                updateVariantSize(vIndex, sIndex, "sku", e.target.value)
                                            }
                                            className="p-2 border rounded"
                                        />

                                        {/* Sale End Date */}
                                        <div className="col-span-2 sm:col-span-6">
                                            <label className="block text-sm font-medium">Sale End Date</label>
                                            <input
                                                type="date"
                                                value={size.discountEndDate || ""}
                                                onChange={(e) =>
                                                    updateVariantSize(
                                                        vIndex,
                                                        sIndex,
                                                        "discountEndDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                            />
                                            {/* Delete Size Button */}
                                            <div className="flex justify-end w-full">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        alert("dbhie")
                                                        const updatedSizes = variant.sizes.filter((_, i) => i !== sIndex);
                                                        updateVariant(vIndex, "sizes", updatedSizes);
                                                    }}
                                                    className="px-3 py-1 mt-2 text-xs text-white bg-red-500 rounded"
                                                >
                                                    Delete Size
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ✅ Variant Media (Mobile view directly after variant details) */}
                            <div className="lg:hidden">
                                <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">
                                    {variant.color || `Variant ${vIndex + 1}`} Media
                                </h3>
                                {/* Images */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleVariantImageUpload(vIndex, e)}
                                    className="block w-full text-sm text-gray-500 border rounded"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {variant.images.map((img, i) => (
                                        <div key={i} className="relative">
                                            <img
                                                src={img}
                                                alt="variant"
                                                className="object-cover w-20 h-20 rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeVariantImage(vIndex, i)}
                                                className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {/* Videos */}
                                <input
                                    type="file"
                                    accept="video/*"
                                    multiple
                                    onChange={(e) => handleVariantVideoUpload(vIndex, e)}
                                    className="block w-full mt-4 text-sm text-gray-500 border rounded"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {variant.videos?.map((vid, i) => (
                                        <div key={i} className="relative">
                                            <video
                                                src={vid}
                                                className="object-cover w-32 h-20 rounded"
                                                controls
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeVariantVideo(vIndex, i)}
                                                className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Remove Variant */}
                            <button
                                type="button"
                                onClick={() => removeVariant(vIndex)}
                                className="px-3 py-1 text-sm text-white bg-red-500 rounded"
                            >
                                ✕ Remove Variant
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addVariant}
                        className="px-3 py-2 text-white bg-blue-600 rounded"
                    >
                        + Add Variant
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => submitProduct(false)}
                        className="px-4 py-2 text-white bg-yellow-600 rounded"
                    >
                        Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={() => submitProduct(true)}
                        className="px-4 py-2 text-white bg-green-600 rounded"
                    >
                        Publish Product
                    </button>
                </div>
            </div>

            {/* ✅ Right Section (Desktop View only) */}
            <div className="hidden space-y-6 lg:block lg:w-80">
                {/* Cover Image */}
                <div className="p-5 bg-white rounded-md shadow">
                    <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Cover Image</h3>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="block w-full text-sm text-gray-500 border rounded"
                    />
                    {productData.coverImage && (
                        <div className="relative w-40 mt-2">
                            <img
                                src={productData.coverImage}
                                alt="Cover"
                                className="object-cover w-40 h-40 rounded"
                            />
                            <button
                                type="button"
                                onClick={removeCoverImage}
                                className="absolute px-1 text-xs text-white bg-red-500 rounded top-1 right-1"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                {/* Variant Media */}
                {productData.variants.map((variant, vIndex) => (
                    <div key={vIndex} className="p-5 bg-white rounded-md shadow">
                        <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">
                            {variant.color || `Variant ${vIndex + 1}`} Media
                        </h3>
                        {/* Images */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleVariantImageUpload(vIndex, e)}
                            className="block w-full text-sm text-gray-500 border rounded"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {variant.images.map((img, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={img}
                                        alt="variant"
                                        className="object-cover w-20 h-20 rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVariantImage(vIndex, i)}
                                        className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        {/* Videos */}
                        <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={(e) => handleVariantVideoUpload(vIndex, e)}
                            className="block w-full mt-4 text-sm text-gray-500 border rounded"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {variant.videos?.map((vid, i) => (
                                <div key={i} className="relative">
                                    <video
                                        src={vid}
                                        className="object-cover w-32 h-20 rounded"
                                        controls
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVariantVideo(vIndex, i)}
                                        className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-4 bg-white rounded shadow-md">
                        <div className="w-10 h-10 mx-auto border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                        <p className="mt-2 text-sm font-medium text-center text-gray-700">
                            {productData.isPublished ? "Publishing..." : "Saving Draft..."}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AddProductPage;
