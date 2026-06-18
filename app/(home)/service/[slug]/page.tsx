'use client';
import PublicPageHero from '../../Components/PublicPageHero';
import MarketLoadingBlock from '../../Components/MarketLoadingBlock';
import FeatureBlogs from '@/app/(home)/Components/FeatureBlogs';
import { Loader2, AlertTriangle, Camera, CircleUserRound, Globe, Import, Mail, MapPin, PenTool, PhoneCall, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Service } from '@/types/service';
import { Review } from '@/types/review';
import { toast } from "react-toastify"
import Link from "next/link";

interface GetServiceBySlugResponse {
    success: boolean;
    data: {
        service: Service;
        reviews: Review[];
    };
}

interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    selectedServices: string[];
    date: string;
    time: string;
}


const ServiceDetailPage = () => {
    const { slug } = useParams() as { slug: string };

    const [service, setService] = useState<Service | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [form, setForm] = useState<BookingFormData>({
        name: '',
        email: '',
        phone: '',
        selectedServices: [],
        date: '',
        time: '',
    });
    const visibleCount = showAll ? reviews.length : 4;

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await axios.get<GetServiceBySlugResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/${slug}`);
                setService(res.data.data.service);
                setReviews(res.data.data.reviews);
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchService();
    }, [slug]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const checked = e.target.checked;

        setForm((prev) => {
            const updatedServices = checked
                ? [...prev.selectedServices, value]
                : prev.selectedServices.filter((item) => item !== value);

            return { ...prev, selectedServices: updatedServices };
        });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.selectedServices.length || !form.date || !form.time) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/create`,
                {
                    serviceId: service?._id,
                    serviceItems: form.selectedServices,
                    date: form.date,
                    time: form.time,
                    notes: `Customer: ${form.name}, Phone: ${form.phone}`,
                    amountPaid: 0,
                    paymentStatus: 'pending',
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("Appointment request submitted!");
                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    selectedServices: [],
                    date: '',
                    time: '',
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit appointment");
        }
    };

    // inside your component render:
    const coords = service?.location?.coordinates; // [lng, lat]
    const [lng, lat] =
        Array.isArray(coords) && coords.length === 2 ? [coords[0], coords[1]] : [undefined, undefined];

    const hasLatLng =
        typeof lat === "number" && Number.isFinite(lat) &&
        typeof lng === "number" && Number.isFinite(lng);

    const mapSrc = hasLatLng
        ? `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
        : `https://www.google.com/maps?q=${encodeURIComponent(service?.contact?.address ?? "")}&z=15&output=embed`;



    if (loading) return (
        <div className="bg-market-bg">
            <MarketLoadingBlock label="Loading service…" minHeight="min-h-[50vh]" />
        </div>
    );

    if (!service) return (
        <div className="bg-market-bg">
            <PublicPageHero title="Service" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Not found" }]} />
            <div className="container-page py-12 text-center text-market-muted">
                <AlertTriangle className="mx-auto mb-2 h-10 w-10 text-red-400" />
                <span>Service not found</span>
            </div>
        </div>
    );
    return (
        <>
            <PublicPageHero
                title={service.title || "Service"}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Services", href: "/services" },
                    { label: service.title || "Service" },
                ]}
                imageUrl={service.coverImage || "/bgdetailpage.png"}
            />
            <main className="container-page py-8">
                <section className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <img
                            src={service.coverImage}
                            alt={service.title || "Service"}
                            className="h-auto w-full rounded-lg object-cover"
                        />
                        <div>
                            <div>
                                {/* <p className="text-xs font-semibold uppercase text-custom-blue">{service.category}</p> */}
                                <h1 className="text-3xl font-bold heading">{service.title}</h1>
                                <div className="flex items-center space-x-2">
                                    <span className="text-yellow-500">★★★★☆</span>
                                    <span className="text-sm text-gray-600">({service.averageRating} rating)</span>
                                </div>
                                <div className="flex flex-wrap gap-2 my-2 text-xs">
                                    {service.services.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 text-gray-800 bg-green-100 rounded-full">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>

                            </div>

                            {/* Description */}
                            <div className="leading-relaxed text-gray-700">
                                <p>
                                    {service.description}
                                </p>

                                {/* List Features */}
                                <ul className="pl-5 mt-4 list-disc">
                                    {service.features.map((feat, i) => (
                                        <li key={i}>{feat}</li>
                                    ))}
                                </ul>


                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3 mt-4">
                                    <button className="flex items-center gap-1 px-4 py-1 transition-all duration-200 ease-in-out border border-custom-blue text-custom-blue hover:bg-custom-orange hover:text-white hover:border-transparent active:bg-custom-orange active:text-white active:border-transparent">
                                        <PenTool size={16} /> Add Review
                                    </button>
                                    {/* <button className="flex items-center gap-1 px-4 py-1 transition-all duration-200 ease-in-out border border-custom-blue text-custom-blue hover:bg-custom-orange hover:text-white hover:border-transparent active:bg-custom-orange active:text-white active:border-transparent">
                                        <Camera size={16} /> Upload Photo
                                    </button>
                                    <button className="flex items-center gap-1 px-4 py-1 transition-all duration-200 ease-in-out border border-custom-blue text-custom-blue hover:bg-custom-orange hover:text-white hover:border-transparent active:bg-custom-orange active:text-white active:border-transparent">
                                        <Import size={16} /> Save
                                    </button> */}
                                    <button className="flex items-center gap-1 px-4 py-1 transition-all duration-200 ease-in-out border border-custom-blue text-custom-blue hover:bg-custom-orange hover:text-white hover:border-transparent active:bg-custom-orange active:text-white active:border-transparent">
                                        <Share2 size={16} /> Share
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>

                    {/* Right - Booking Form */}
                    <aside className="space-y-6 lg:col-span-1">
                        <div className="p-4 pt-0 border rounded-lg shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold heading">Schedule a Booking</h3>
                            <form className="space-y-3" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />

                                {/* ✅ Service Selection */}
                                <div className="space-y-1">
                                    <p className="font-medium">What type of service do you need?</p>
                                    {service.services.map((svc: any) => (
                                        <label key={svc._id} className="block">
                                            <input
                                                type="checkbox"
                                                name="selectedService"
                                                value={svc.name}
                                                checked={form.selectedServices.includes(svc.name)}
                                                onChange={handleCheckboxChange}
                                            />{' '}
                                            {svc.name}
                                        </label>
                                    ))}
                                </div>


                                {/* ✅ Date Picker */}
                                <div>
                                    <label className="block mb-1 font-medium">Select Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* ✅ Time Picker */}
                                <div>
                                    <label className="block mb-1 font-medium">Select Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={form.time}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full p-2 text-white rounded bg-custom-blue hover:bg-teal-700"
                                >
                                    Request an Appointment
                                </button>
                            </form>

                        </div>
                        {/* Contact Info */}
                        <div className="p-4 border-t-2 border-b-2 border-gray-300 shadow-sm">
                            <h3 className="text-lg font-semibold heading">Contact Us</h3>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-full p-2 bg-custom-orange">
                                    <PhoneCall size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-sm text-gray-800">
                                    <span className="p-0 m-0 font-medium leading-tight text-custom-orange">Call Us:</span>
                                    <a
                                        href={`tel:${service.contact.phone}`}
                                        className="p-0 m-0 leading-tight text-gray-800 hover:underline"
                                    >
                                        {service.contact.phone}
                                    </a>

                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-full p-2 bg-custom-orange">
                                    <Mail size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-sm text-gray-800">
                                    <span className="p-0 m-0 font-medium leading-tight text-custom-orange">Email Us:</span>
                                    <a
                                        href={`mailto:${service.contact.email}`}
                                        className="p-0 m-0 leading-tight text-gray-800 hover:underline"
                                    >
                                        {service.contact.email}
                                    </a>

                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-full p-2 bg-custom-orange">
                                    <MapPin size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-sm text-gray-800">
                                    <span className="p-0 m-0 font-medium leading-tight text-custom-orange">Address:</span>
                                    <span className="p-0 m-0 leading-tight">{service.contact.address}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-full p-2 bg-custom-orange">
                                    <Globe size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-sm text-gray-800">
                                    <span className="p-0 m-0 font-medium leading-tight text-custom-orange">Website:</span>
                                    <a
                                        href={service.contact.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-0 m-0 leading-tight text-gray-800 hover:underline"
                                    >
                                        {service.contact.website}
                                    </a>
                                </div>
                            </div>

                        </div>
                    </aside>


                    {/* Rest of Content */}
                    <div className="mt-8 space-y-12 md:col-span-2">
                        {/* Title & Meta */}


                        {/* Photo Gallery */}
                        <div>
                            <h2 className="mb-2 text-xl font-semibold heading">Photo Gallery</h2>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {service.images.map((img, i) => (
                                    <div key={i} className="relative w-full overflow-hidden rounded aspect-square">
                                        <img
                                            src={img}
                                            alt={`Gallery Image ${i + 1}`}
                                            className="absolute inset-0 object-cover w-full h-full"
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>


                        {/* Location + Hours */}
                        <div>
                            <h2 className="mb-4 text-xl font-semibold heading">Location and Hours</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                {/* Business Hours */}
                                <div className="p-4 space-y-1 text-sm text-gray-800 border rounded-lg shadow-sm bg-gray-50">
                                    {service.businessHours.map(({ day, hours }) => (
                                        <div key={day} className="flex items-center justify-between pb-1 border-b last:border-b-0">
                                            <span className="w-1/2 font-medium tracking-wide">{day}</span>
                                            <span className="w-1/2 text-right">{hours}</span>
                                        </div>
                                    ))}

                                </div>

                                {/* Map */}

                                <div className="mt-2 overflow-hidden rounded-lg shadow-sm md:mt-0">
                                    <iframe
                                        title="Service Location"
                                        src={mapSrc}
                                        width="100%"
                                        height="260"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                            <div className="mt-5">
                                <button
                                    onClick={() => {
                                        const url = hasLatLng
                                            ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                                            : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                                service?.contact?.address ?? ""
                                            )}`;
                                        window.open(url, "_blank");
                                    }}
                                    className="px-5 py-2 font-medium text-white transition-all bg-orange-500 rounded hover:bg-orange-600"
                                >
                                    Get Directions
                                </button>
                            </div>

                        </div>

                        {/* Amenities */}
                        <div>
                            <h2 className="mb-2 text-xl font-semibold heading">Amenities</h2>
                            <ul className="grid grid-cols-2 gap-2 text-gray-700">
                                {service.amenities.map(({ label, available }, i) => (
                                    <li key={i}>
                                        {available ? "✔️" : "❌"} {label}
                                    </li>
                                ))}
                            </ul>
                        </div>


                        {/* FAQ */}
                        <div>
                            <h2 className="mb-2 text-xl font-semibold heading">FAQ</h2>
                            {service.faq.map((item, i) => (
                                <details key={i} className="market-accordion-light mb-2">
                                    <summary>{item.question}</summary>
                                    <p className="market-accordion-light-body">{item.answer}</p>
                                </details>
                            ))}

                        </div>

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <div>
                                <h2 className="mb-2 text-xl font-semibold heading">Review Highlights</h2>
                                {reviews.slice(0, visibleCount).map((review, i) => (
                                    <div key={i} className="p-4 mb-3 border rounded">
                                        <div className="flex gap-3">
                                            {review.userId.profileImage ? (
                                                <div className="relative w-10 h-10 overflow-hidden rounded-full">
                                                    <Image
                                                        src={review.userId.profileImage}
                                                        alt={review.userId.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <CircleUserRound className="w-10 h-10 text-gray-400" />
                                            )}

                                            <div className="flex flex-col justify-center">
                                                <p className="font-bold leading-none roboto">{review.userId.name}</p>
                                                {/* <p className="text-xs leading-tight text-gray-500">{review.role}</p> */}
                                                <p className="text-sm leading-tight text-yellow-500">
                                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-gray-700">{review.comment}</p>
                                    </div>
                                ))}

                                {/* Show button only if there are more than 4 reviews */}
                                {reviews.length > 4 && (
                                    <div className="text-center">
                                        <button
                                            className="mt-2 font-bold text-custom-orange hover:underline"
                                            onClick={() => setShowAll(!showAll)}
                                        >
                                            {showAll ? "Show Less" : "View More +"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

            </main>
            <FeatureBlogs />
        </>
    );
};

export default ServiceDetailPage;
