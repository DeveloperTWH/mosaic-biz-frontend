'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Service } from '@/types/service'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { uploadToS3 } from '@/utils/s3Uploader';

interface CreateServiceFormProps {
    businessId: string;
    businessSlug: string;
}

type CategorySelection = {
    categoryId: string;
};

type Amenity = {
    label: string;
    available: boolean;
    isDefault?: boolean;
};

type FAQ = {
    question: string;
    answer: string;
};

type NamedService = {
    name: string;
};



const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ businessId, businessSlug }) => {

    const router = useRouter()

    const days: string[] = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];


    const defaultBusinessHours = days.map(day => ({
        day,
        hours: '', // or 'Closed'
    }));
    const defaultAmenities = [
        { label: 'Home Visit Available', available: false, isDefault: true },
        { label: 'Waiting Area', available: false, isDefault: true },
        { label: 'Free Wi-Fi', available: false, isDefault: true },
        { label: 'Parking Available', available: false, isDefault: true },
        { label: 'Wheelchair Accessible', available: false, isDefault: true },
        { label: 'Appointment Booking', available: false, isDefault: true },
    ];


    const [serviceData, setServiceData] = useState<{
        title: string;
        description: string;
        price: number;
        duration: string;
        services: NamedService[];
        categories: CategorySelection[];
        coverImage: string;
        images: string[];
        videos: string[];
        features: string[];
        amenities: Amenity[];
        businessHours: { day: string; hours: string }[];
        location: { type: 'Point'; coordinates: [number, number] };
        contact: { phone: string; email: string; address: string; website: string };
        faq: FAQ[];
        maxBookingsPerSlot: number;
        isPublished: boolean;
    }>({
        title: '',
        description: '',
        price: 0,
        duration: '',
        services: [{ name: '' }],
        categories: [],
        coverImage: '',
        images: [],
        videos: [],
        features: [''],
        amenities: defaultAmenities,
        businessHours: defaultBusinessHours,
        location: { type: 'Point', coordinates: [0, 0] },
        contact: { phone: '', email: '', address: '', website: '' },
        faq: [{ question: '', answer: '' }],
        maxBookingsPerSlot: 1,
        isPublished: false,
    });

    const [serviceCategories, setServiceCategories] = useState<{ _id: string; name: string }[]>([]);
    const [categories, setCategories] = useState<{ categoryId: string }[]>([]);



    const [bulkStartTime, setBulkStartTime] = useState('');
    const [bulkEndTime, setBulkEndTime] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);


    const [isSubmitting, setIsSubmitting] = useState(false);
    // State to track structured fields
    const [addressFields, setAddressFields] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
    });

    // Updates structured fields and combines into single address
    const updateAddressField = (key: string, value: string) => {
        const updatedFields = { ...addressFields, [key]: value };

        const fullAddress = [
            updatedFields.addressLine1,
            updatedFields.addressLine2,
            updatedFields.city,
            updatedFields.state,
            updatedFields.zip,
        ]
            .filter(Boolean)
            .join(', ');

        setAddressFields(updatedFields);
        setServiceData((prev: any) => ({
            ...prev,
            contact: {
                ...prev.contact,
                address: fullAddress,
            },
        }));
    };


    const toggleSelectedDay = (index: number) => {
        setSelectedDays(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const applyBulkHours = () => {
        const updated = [...serviceData.businessHours];
        selectedDays.forEach(index => {
            updated[index].hours = `${bulkStartTime} - ${bulkEndTime}`;
        });
        setServiceData(prev => ({ ...prev, businessHours: updated }));
    };

    const handleChange = (key: string, value: any) => {
        setServiceData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleUseCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`
                    );
                    const data = await response.json();

                    const result = data.results?.[0];
                    const components = result?.address_components || [];

                    const getComponent = (types: string[]) =>
                        components.find((c: any) => types.every(t => c.types.includes(t)))?.long_name || '';

                    const addressLine1 = getComponent(['sublocality']) || getComponent(['route']) || '';
                    const addressLine2 = getComponent(['premise']) || getComponent(['neighborhood']) || '';
                    const city = getComponent(['locality']) || '';
                    const state = getComponent(['administrative_area_level_1']) || '';
                    const zip = getComponent(['postal_code']) || '';

                    const fullAddress = [
                        addressLine1,
                        addressLine2,
                        city,
                        state,
                        zip,
                    ].filter(Boolean).join(', ');

                    // Fallback if no address
                    if (!fullAddress) {
                        alert('Failed to retrieve address. Dummy data is entered');

                        setAddressFields({
                            addressLine1: 'EP Block, Bidhannagar',
                            addressLine2: 'Arch Square',
                            city: 'Kolkata',
                            state: 'West Bengal',
                            zip: '72001',
                        });

                        setServiceData((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, address: 'EP Block, Bidhannagar, Arch Square, Kolkata, West Bengal, 72001' },
                            location: {
                                type: 'Point',
                                coordinates: [88.43846940063182, 22.57463569699314], // dummy
                            },
                        }));
                        return;
                    }

                    // Set state
                    setAddressFields({ addressLine1, addressLine2, city, state, zip });

                    setServiceData((prev: any) => ({
                        ...prev,
                        contact: { ...prev.contact, address: fullAddress },
                        location: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                    }));
                } catch (error) {
                    console.error('Google reverse geocoding failed:', error);
                    alert('Reverse geocoding failed.');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Failed to get current location.');
            }
        );
    };




    const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const urls = Array.from(files).map(file => URL.createObjectURL(file));
        if (key === 'coverImage') setServiceData((prev: any) => ({ ...prev, coverImage: urls[0] }));
        else setServiceData((prev: any) => ({ ...prev, [key]: [...prev[key], ...urls] }));
    };

    const removeImage = (key: string | number) => {
        if (key === 'coverImage') {
            setServiceData((prev: any) => ({ ...prev, coverImage: '' }));
        } else {
            setServiceData((prev: any) => ({
                ...prev,
                images: prev.images.filter((_: string, i: number) => i !== key),
            }));
        }
    };

    const removeVideo = (index: number) => {
        setServiceData((prev: any) => ({
            ...prev,
            videos: prev.videos.filter((_: string, i: number) => i !== index),
        }));
    };
    const handleBusinessHourChange = (
        index: number,
        key: 'day' | 'hours',
        value: string
    ) => {
        const updated = [...serviceData.businessHours];
        updated[index][key] = value;
        setServiceData((prev: any) => ({ ...prev, businessHours: updated }));
    };


    const handleContactChange = (key: string, value: string) => {
        setServiceData((prev: any) => ({
            ...prev,
            contact: { ...prev.contact, [key]: value },
        }));
    };

    const addCategory = () => {
        setServiceData((prev) => ({
            ...prev,
            categories: [...prev.categories, { categoryId: '' }],
        }));
    };

    const updateCategory = (
        index: number,
        key: keyof CategorySelection,
        value: string | string[]
    ) => {
        const updated = [...serviceData.categories];
        updated[index][key] = value as never;
        setServiceData((prev) => ({ ...prev, categories: updated }));
    };


    const removeCategory = (index: number) => {
        const updated = [...serviceData.categories];
        updated.splice(index, 1);
        setServiceData((prev) => ({ ...prev, categories: updated }));
    };

    const addFeature = () => setServiceData((prev) => ({ ...prev, features: [...prev.features, ''] }));
    const updateFeature = (index: number, value: string) => {
        const updated = [...serviceData.features];
        updated[index] = value;
        setServiceData((prev) => ({ ...prev, features: updated }));
    };
    const removeFeature = (index: number) => {
        const updated = [...serviceData.features];
        updated.splice(index, 1);
        setServiceData((prev) => ({ ...prev, features: updated }));
    };

    const toggleAmenity = (idx: number) => {
        setServiceData(prev => ({
            ...prev,
            amenities: prev.amenities.map((am, i) =>
                i === idx ? { ...am, available: !am.available } : am
            ),
        }));
    };

    const updateAmenity = (idx: number, value: string) => {
        setServiceData(prev => ({
            ...prev,
            amenities: prev.amenities.map((am, i) =>
                i === idx ? { ...am, label: value } : am
            ),
        }));
    };

    const addAmenity = () => {
        setServiceData(prev => ({
            ...prev,
            amenities: [...prev.amenities, { label: '', available: true, isDefault: false }],
        }));
    };

    const removeAmenity = (idx: number) => {
        const amenity = serviceData.amenities[idx];
        if (amenity.isDefault) return; // prevent removing default ones
        setServiceData(prev => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== idx),
        }));
    };


    const addFaq = () => {
        setServiceData((prev) => ({
            ...prev,
            faq: [...prev.faq, { question: '', answer: '' }],
        }));
    };

    const updateFaq = (
        index: number,
        key: keyof FAQ,
        value: string
    ) => {
        const updated = [...serviceData.faq];
        updated[index][key] = value;
        setServiceData((prev) => ({ ...prev, faq: updated }));
    };


    const removeFaq = (index: number) => {
        const updated = [...serviceData.faq];
        updated.splice(index, 1);
        setServiceData((prev) => ({ ...prev, faq: updated }));
    };



    const validateServiceData = (serviceData: any): boolean => {
        if (!serviceData.title?.trim()) {
            toast.error('Title is required');
            return false;
        }

        if (!serviceData.description?.trim()) {
            toast.error('Description is required');
            return false;
        }

        if (!serviceData.price || isNaN(Number(serviceData.price))) {
            toast.error('Valid price is required');
            return false;
        }

        if (!serviceData.duration?.trim()) {
            toast.error('Please enter the duration');
            return false;
        }

        if (!serviceData.coverImage) {
            toast.error('Please upload at least one image');
            return false;
        }

        if (!serviceData.contact?.phone?.trim()) {
            toast.error('Please enter a valid phone number');
            return false;
        }

        if (!serviceData.contact?.email?.trim()) {
            toast.error('Please enter a valid email');
            return false;
        }

        if (!serviceData.contact?.website?.trim()) {
            toast.error('Please enter a website');
            return false;
        }

        if (!serviceData.contact?.address?.trim()) {
            toast.error('We are unable to get your location');
            return false;
        }

        // ✅ Business Hours Validation
        for (const entry of serviceData.businessHours) {
            if (entry.hours !== 'Closed') {
                const [start, end] = entry.hours?.split(' - ') || [];
                if (!start || !end) {
                    toast.error(`Please enter both start and end time or mark "${entry.day}" as Closed`);
                    return false;
                }
            }
        }

        // ✅ Services Offered
        if (!serviceData.services || serviceData.services.length === 0) {
            toast.error('Please add at least one service offered');
            return false;
        }

        for (const entry of serviceData.services) {
            if (!entry.name?.trim()) {
                toast.error('Please enter a name for each service offered');
                return false;
            }
        }

        // ✅ Features
        if (!serviceData.features || serviceData.features.length === 0) {
            toast.error('Please add at least one feature');
            return false;
        }

        for (const feature of serviceData.features) {
            if (!feature?.trim()) {
                toast.error('Feature cannot be empty');
                return false;
            }
        }

        // ✅ Categories
        if (!serviceData.categories || serviceData.categories.length === 0) {
            toast.error('Please select at least one category');
            return false;
        }

        for (const cat of serviceData.categories) {
            console.log(cat);

            if (!cat.categoryId) {
                toast.error('Category ID cannot be empty');
                return false;
            }
        }

        // ✅ FAQ
        for (const faq of serviceData.faq || []) {
            if (!faq.question?.trim() || !faq.answer?.trim()) {
                toast.error('Please fill all FAQ questions and answers');
                return false;
            }
        }

        return true;
    };


    const submitService = async (publish: boolean) => {
        if (!validateServiceData(serviceData)) return;

        if (!businessId) {
            alert("Business ID is missing.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Uploading service files to S3...");

            // ✅ 1. Upload Cover Image
            let coverImageUrl = serviceData.coverImage;
            if (coverImageUrl?.startsWith("blob:")) {
                const blob = await fetch(coverImageUrl).then((r) => r.blob());
                const fileObj = new File([blob], `service-cover-${Date.now()}.jpg`, {
                    type: blob.type || "image/jpeg",
                });
                coverImageUrl = await uploadToS3(fileObj);
            }

            // ✅ 2. Upload Images
            const uploadedImages = await Promise.all(
                (serviceData.images || []).map(async (imgUrl, i) => {
                    if (imgUrl.startsWith("blob:")) {
                        const blob = await fetch(imgUrl).then((r) => r.blob());
                        const fileObj = new File([blob], `service-img-${Date.now()}-${i}.jpg`, {
                            type: blob.type || "image/jpeg",
                        });
                        return await uploadToS3(fileObj);
                    }
                    return imgUrl;
                })
            );

            // ✅ 3. Upload Videos
            const uploadedVideos = await Promise.all(
                (serviceData.videos || []).map(async (vidUrl, i) => {
                    if (vidUrl.startsWith("blob:")) {
                        const blob = await fetch(vidUrl).then((r) => r.blob());
                        const fileObj = new File([blob], `service-vid-${Date.now()}-${i}.mp4`, {
                            type: blob.type || "video/mp4",
                        });
                        return await uploadToS3(fileObj);
                    }
                    return vidUrl;
                })
            );

            // ✅ 4. Final Payload
            const payload = {
                ...serviceData,
                businessId: businessId,
                isPublished: publish,
                coverImage: coverImageUrl,
                images: uploadedImages,
                videos: uploadedVideos,
            };

            console.log(publish ? "Publishing service..." : "Saving draft...", payload);

            // ✅ 5. API Call
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/service`,
                payload,
                { withCredentials: true }
            );

            toast.success(publish ? "✅ Service Published!" : "✅ Draft Saved!");
            router.push(`/partners/${businessSlug}/inventory`);
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`);
                const data = await response.json();

                if (response.ok && data?.success && data?.data) {
                    setServiceCategories(data.data.serviceCategories || []);
                    setCategories([]); // Clear selected category if needed
                } else {
                    console.error('Invalid category response:', data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);



    return (
        <div className="flex flex-col lg:flex-row lg:gap-6">
            <div className="flex-1 space-y-6">
                <h1 className="text-xl font-semibold roboto">Add New Service</h1>

                <div className="p-5 space-y-4 bg-white rounded-md shadow">
                    <h2 className="pb-2 text-base font-semibold border-b roboto">Service Details</h2>

                    <input type="text" placeholder="Title" value={serviceData.title} required onChange={(e) => handleChange('title', e.target.value)} className="w-full p-2 border rounded" />
                    <textarea placeholder="Description" value={serviceData.description} required onChange={(e) => handleChange('description', e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Price" required value={serviceData.price || ''} onChange={(e) => handleChange('price', Number(e.target.value))} className="w-full p-2 border rounded" />
                    <input type="text" placeholder="Duration (e.g., 30 min)" required value={serviceData.duration} onChange={(e) => handleChange('duration', e.target.value)} className="w-full p-2 border rounded" />

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Services We Offer</h3>
                        {serviceData.services.map((service, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={service.name}
                                    onChange={(e) => {
                                        const updated = [...serviceData.services];
                                        updated[index].name = e.target.value;
                                        setServiceData((prev) => ({ ...prev, services: updated }));
                                    }}
                                    placeholder={`Service ${index + 1}`}
                                    className="flex-1 p-2 border rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = serviceData.services.filter((_, i) => i !== index);
                                        setServiceData((prev) => ({ ...prev, services: updated }));
                                    }}
                                    className="px-3 text-red-600 border border-red-300 rounded hover:bg-red-50"
                                    disabled={serviceData.services.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                setServiceData((prev) => ({
                                    ...prev,
                                    services: [...prev.services, { name: '' }],
                                }))
                            }
                            className="px-4 py-2 mt-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            + Add Service
                        </button>
                    </div>


                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Business Hours</h3>

                        {/* 🔁 Bulk Apply Section */}
                        <div className="p-4 space-y-3 border rounded-md bg-gray-50">
                            <p className="text-sm font-medium text-gray-800">Apply hours to multiple days</p>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <input
                                    type="time"
                                    value={bulkStartTime}
                                    onChange={(e) => setBulkStartTime(e.target.value)}
                                    className="w-full p-2 text-sm border rounded sm:w-40"
                                />
                                <span className="text-sm text-gray-500">to</span>
                                <input
                                    type="time"
                                    value={bulkEndTime}
                                    onChange={(e) => setBulkEndTime(e.target.value)}
                                    className="w-full p-2 text-sm border rounded sm:w-40"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 pt-1">
                                {days.map((day: string, i: number) => (
                                    <label key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.includes(i)}
                                            onChange={() => toggleSelectedDay(i)}
                                            className="accent-blue-600"
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>

                            <button
                                onClick={applyBulkHours}
                                className="px-4 py-1 mt-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                Apply to Selected Days
                            </button>
                        </div>

                        {/* 🧾 Daily View */}
                        <div className="space-y-4">
                            {serviceData.businessHours.map((entry, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-3">
                                    <div className="text-sm font-medium text-gray-800 w-28">{entry.day}</div>

                                    <select
                                        value={entry.hours === 'Closed' ? 'Closed' : 'Open'}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleBusinessHourChange(index, 'hours', value === 'Closed' ? 'Closed' : '');
                                        }}
                                        className="p-2 text-sm border rounded w-28"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                    </select>

                                    {entry.hours !== 'Closed' && (
                                        <>
                                            <input
                                                type="time"
                                                value={entry.hours?.split(' - ')[0] || ''}
                                                required
                                                onChange={(e) => {
                                                    const end = entry.hours?.split(' - ')[1] || '';
                                                    handleBusinessHourChange(index, 'hours', `${e.target.value} - ${end}`);
                                                }}
                                                className="p-2 text-sm border rounded w-36"
                                            />
                                            <span className="text-sm text-gray-600">to</span>
                                            <input
                                                type="time"
                                                value={entry.hours?.split(' - ')[1] || ''}
                                                required
                                                onChange={(e) => {
                                                    const start = entry.hours?.split(' - ')[0] || '';
                                                    handleBusinessHourChange(index, 'hours', `${start} - ${e.target.value}`);
                                                }}
                                                className="p-2 text-sm border rounded w-36"
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="lg:hidden">
                        <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Cover Image</h3>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload('coverImage', e)} className="w-full p-2 border rounded" />
                        {serviceData.coverImage && (
                            <div className="relative w-full mt-2">
                                <img src={serviceData.coverImage} alt="Cover" className="object-cover w-auto h-auto rounded" />
                                <button onClick={() => removeImage('coverImage')} className="absolute px-1 text-xs text-white bg-red-500 rounded top-1 right-1">✕</button>
                            </div>
                        )}
                    </div>

                    <div className="lg:hidden">
                        <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Gallery Images</h3>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileUpload('images', e)}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {serviceData.images.map((img: string, i: number) => (
                                <div key={i} className="relative">
                                    <img
                                        src={img}
                                        alt={`img-${i}`}
                                        className="object-cover w-24 h-24 rounded"
                                    />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Videos */}
                    <div className="lg:hidden">
                        <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Promo Videos</h3>
                        <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={(e) => handleFileUpload('videos', e)}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {serviceData.videos.map((vid: string, i: number) => (
                                <div key={i} className="relative">
                                    <video
                                        src={vid}
                                        controls
                                        className="object-cover w-40 h-24 rounded"
                                    />
                                    <button
                                        onClick={() => removeVideo(i)}
                                        className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Contact Info</h3>
                        <input type="text" placeholder="Phone" value={serviceData.contact.phone} required onChange={(e) => handleContactChange('phone', e.target.value)} className="w-full p-2 border rounded" />
                        <input type="email" placeholder="Email" value={serviceData.contact.email} required onChange={(e) => handleContactChange('email', e.target.value)} className="w-full p-2 border rounded" />
                        <input type="text" placeholder="Website" value={serviceData.contact.website || ''} onChange={(e) => handleContactChange('website', e.target.value)} className="w-full p-2 border rounded" />
                        <div className="p-4 space-y-3 border rounded-md">
                            <h3 className="text-base font-semibold roboto">Business Address</h3>

                            <input
                                type="text"
                                placeholder="Street Address"
                                value={addressFields.addressLine1}
                                required
                                onChange={(e) => updateAddressField('addressLine1', e.target.value)}
                                className="w-full p-2 text-sm border rounded"
                            />

                            <input
                                type="text"
                                placeholder="Apartment, Suite, etc. (optional)"
                                value={addressFields.addressLine2}
                                required
                                onChange={(e) => updateAddressField('addressLine2', e.target.value)}
                                className="w-full p-2 text-sm border rounded"
                            />

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={addressFields.city}
                                    required
                                    onChange={(e) => updateAddressField('city', e.target.value)}
                                    className="w-full p-2 text-sm border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={addressFields.state}
                                    required
                                    onChange={(e) => updateAddressField('state', e.target.value)}
                                    className="w-full p-2 text-sm border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="ZIP Code"
                                    value={addressFields.zip}
                                    required
                                    onChange={(e) => updateAddressField('zip', e.target.value)}
                                    className="w-full p-2 text-sm border rounded"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    className="px-4 py-1 mt-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    Use Current Location
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* 🏷️ Category */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Category</h3>

                        {/* Single Dropdown to Add Categories */}
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value=""
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const alreadyAdded = serviceData.categories.some(
                                        (cat) => cat.categoryId === selectedId
                                    );

                                    if (selectedId && !alreadyAdded) {
                                        const newCategories = [...serviceData.categories, { categoryId: selectedId, subcategoryIds: [] }];
                                        setServiceData((prev) => ({ ...prev, categories: newCategories }));
                                    }
                                }}
                                className="w-full p-2 border rounded sm:w-60"
                            >
                                <option value="">Select Category</option>
                                {serviceCategories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Display Selected Categories as Blue Pills */}
                        {serviceData.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {serviceData.categories.map((cat) => {
                                    const matched = serviceCategories.find(c => c._id === cat.categoryId);
                                    if (!matched) return null;

                                    return (
                                        <div
                                            key={cat.categoryId}
                                            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-700 border-2 border-blue-600 rounded-full bg-blue-50"
                                        >
                                            {matched.name}
                                            <button
                                                onClick={() => {
                                                    const newList = serviceData.categories.filter(
                                                        (c) => c.categoryId !== cat.categoryId
                                                    );
                                                    setServiceData((prev) => ({ ...prev, categories: newList }));
                                                }}
                                                className="text-blue-600 hover:text-red-500"
                                                title="Remove"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    {/* 🌟 Features */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {serviceData.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => updateFeature(idx, e.target.value)}
                                        className="w-full p-2 border rounded"
                                        placeholder={`Feature ${idx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(idx)}
                                        className="px-2 text-white bg-red-500 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
                        >
                            + Add Feature
                        </button>
                    </div>

                    {/* 🏨 Amenities */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Amenities</h3>

                        <div className="flex flex-wrap gap-3">
                            {serviceData.amenities.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => toggleAmenity(idx)}
                                    className={`cursor-pointer px-4 py-2 rounded-full border text-sm transition 
          ${item.available ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-700'} 
          flex items-center gap-2`}
                                >
                                    {item.isDefault ? (
                                        item.label
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                value={item.label}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => updateAmenity(idx, e.target.value)}
                                                className="w-40 px-2 py-1 text-sm border rounded"
                                                placeholder="Custom Amenity"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAmenity(idx);
                                                }}
                                                className="text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addAmenity}
                            className="px-3 py-1 mt-2 text-sm text-white bg-blue-600 rounded"
                        >
                            + Add Amenity
                        </button>
                    </div>


                    {/* ❓ FAQ Section */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">FAQ</h3>
                        {serviceData.faq.map((faqItem, idx) => (
                            <div key={idx} className="space-y-2">
                                <input
                                    type="text"
                                    value={faqItem.question}
                                    onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Question"
                                />
                                <textarea
                                    value={faqItem.answer}
                                    onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Answer"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFaq(idx)}
                                    className="px-2 text-white bg-red-500 rounded"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addFaq}
                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
                        >
                            + Add FAQ
                        </button>
                    </div>

                    {/* 📌 Max Bookings Per Slot */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Max Bookings per Slot</h3>
                        <input
                            type="number"
                            value={serviceData.maxBookingsPerSlot}
                            onChange={(e) =>
                                setServiceData((prev) => ({
                                    ...prev,
                                    maxBookingsPerSlot: parseInt(e.target.value, 10) || 1,
                                }))
                            }
                            min={1}
                            className="w-full p-2 border rounded sm:w-60"
                        />
                    </div>

                </div>

                <div className="flex gap-4">
                    <button type="button" onClick={() => submitService(false)} className="px-4 py-2 text-white bg-yellow-600 rounded">
                        Save Draft
                    </button>
                    <button type="button" onClick={() => submitService(true)} className="px-4 py-2 text-white bg-green-600 rounded">
                        Publish Service
                    </button>
                </div>
            </div>

            <div className="hidden space-y-6 lg:block lg:w-80">
                <div className="p-5 bg-white rounded-md shadow">
                    <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Cover Image</h3>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload('coverImage', e)} className="w-full p-2 border rounded" />
                    {serviceData.coverImage && (
                        <div className="relative w-full mt-2">
                            <img src={serviceData.coverImage} alt="Cover" className="object-cover w-auto h-auto rounded" />
                            <button onClick={() => removeImage('coverImage')} className="absolute px-1 text-xs text-white bg-red-500 rounded top-1 right-1">✕</button>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-white rounded-md shadow">
                    <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Media</h3>
                    <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload('images', e)} className="w-full p-2 border rounded" />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {serviceData.images.map((img: string, i: number) => (
                            <div key={i} className="relative">
                                <img src={img} alt="Service" className="object-cover w-20 h-20 rounded" />
                                <button onClick={() => removeImage(i)} className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded">✕</button>
                            </div>
                        ))}
                    </div>

                    <input type="file" accept="video/*" multiple onChange={(e) => handleFileUpload('videos', e)} className="w-full p-2 mt-4 border rounded" />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {serviceData.videos.map((vid: string, i: number) => (
                            <div key={i} className="relative">
                                <video src={vid} className="object-cover w-32 h-20 rounded" controls />
                                <button onClick={() => removeVideo(i)} className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-4 bg-white rounded shadow-md">
                        <div className="w-10 h-10 mx-auto border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                        <p className="mt-2 text-sm font-medium text-center text-gray-700">
                            {serviceData.isPublished ? 'Publishing...' : 'Saving Draft...'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateServiceForm;
