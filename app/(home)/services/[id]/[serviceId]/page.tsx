'use client';
import FeatureBlogs from '@/app/(home)/Components/FeatureBlogs';
import { Camera, CircleUserRound, Globe, Import, Mail, MapPin, PenTool, PhoneCall, Share2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

const service = {
    id: 1,
    title: "Lorem Ipsum Skin & Beauty Care",
    category: "Skin & Beauty Treatment",
    rating: 4.8,
    tags: ["Skin Care", "Skin Treatment"],
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae harum temporibus dolore exercitationem delectus perspiciatis eos, saepe quo veniam similique ratione dicta repellendus tenetur voluptas tempora! Placeat ipsa, incidunt reiciendis nobis eveniet explicabo? Tempore eos omnis nulla minima aliquam temporibus numquam magni in blanditiis suscipit, ad ea quas obcaecati id.",
    features: [
        "Lorem Ipsum Dolor Sit Amet",
        "Consectetur Adipisicing Elit",
        "Sed Do Eiusmod Tempor Incididunt",
    ],
    services: [
        { id: 1, name: "Skin Treatment" },
        { id: 2, name: "Hair Spa" },
        { id: 3, name: "Massage Therapy" },
        { id: 4, name: "Laser Hair Removal" },
    ],
    bannerImage: "/Service/service_banner.png",
    galleryImages: [
        "/Service/service_banner.png",
        "/Service/service_banner.png",
        "/Service/service_banner.png",
        "/Service/service_banner.png",
        "/Service/service_banner.png",
        "/Service/service_banner.png",
    ],
    amenities: [
        { label: "Appointment Booking Only", available: true },
        { label: "Wheelchair Accessible", available: true },
        { label: "Accepts Credit Card", available: true },
        { label: "Accessible Parking", available: true },
        { label: "Accepts Insurance", available: false },
        { label: "Free Wifi", available: true },
    ],
    businessHours: [
        { day: "MONDAY", hours: "8:00 A.M - 6:00 P.M" },
        { day: "TUESDAY", hours: "8:00 A.M - 6:00 P.M" },
        { day: "WEDNESDAY", hours: "8:00 A.M - 6:00 P.M" },
        { day: "THURSDAY", hours: "8:00 A.M - 6:00 P.M" },
        { day: "FRIDAY", hours: "8:00 A.M - 6:00 P.M" },
        { day: "SATURDAY", hours: "8:00 A.M - 6:00 P.M" },
        { day: "SUNDAY", hours: "CLOSED" },
    ],
    locationMapEmbedUrl: "https://www.google.com/maps/embed?...",
    contact: {
        phone: "+123 456 7890",
        email: "loremipsum@gmail.com",
        address: "Lorem Ipsum",
        website: "loremipsum.com"
    },
    faq: [
        {
            question: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            question: "Do you accept walk-ins?",
            answer: "Currently we offer services by appointment only for the best experience."
        },
        {
            question: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
    ],
    reviews: [
        {
            name: "John Doe",
            role: "Businessman",
            rating: 4,
            comment: "Great service, very friendly staff!",
            image: ""  // Example path or URL
        },
        {
            name: "John Doe",
            role: "Businessman",
            rating: 4,
            comment: "Great service, very friendly staff!",
            image: ""  // Example path or URL
        },
        {
            name: "John Doe",
            role: "Businessman",
            rating: 4,
            comment: "Great service, very friendly staff!",
            image: ""  // Example path or URL
        },
        {
            name: "John Doe",
            role: "Businessman",
            rating: 4,
            comment: "Great service, very friendly staff!",
            image: ""  // Example path or URL
        },
        {
            name: "John Doe",
            role: "Businessman",
            rating: 4,
            comment: "Great service, very friendly staff!",
            image: ""  // Example path or URL
        },
        {
            name: "John Doe",
            role: "Businessman",
            rating: 4,
            comment: "Great service, very friendly staff!",
            image: ""  // Example path or URL
        },
        {
            name: "Jane Smith",
            role: "Freelancer",
            rating: 5,
            comment: "Absolutely loved the facial treatment.",
            image: ""
        }
    ]

};


const ServiceDetailPage = () => {
    const [showAll, setShowAll] = useState(false);
    const visibleCount = showAll ? service.reviews.length : 4;
    return (
        <>
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-4">
                    Home &gt; Services &gt; <span className="text-black font-semibold">{service.title}</span>
                </nav>

                {/* Top Split Section: Banner + Booking Form */}
                <section className="grid md:grid-cols-3 gap-8 mb-10">
                    {/* Left - Banner */}
                    <div className="md:col-span-2 space-y-6">
                        <img
                            src="/Service/service_banner.png"
                            alt="Service"
                            className="w-full h-auto rounded-lg object-cover"
                        />
                        <div>
                            <div>
                                <p className="text-custom-blue uppercase font-semibold text-xs">{service.category}</p>
                                <h1 className="text-3xl font-bold heading">{service.title}</h1>
                                <div className="flex items-center space-x-2">
                                    <span className="text-yellow-500">★★★★☆</span>
                                    <span className="text-gray-600 text-sm">({service.rating} rating)</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs my-2">
                                    {service.tags.map((tag, i) => (
                                        <span key={i} className="bg-green-100 text-gray-800 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                            </div>

                            {/* Description */}
                            <div className="text-gray-700 leading-relaxed">
                                <p>
                                    {service.description}
                                </p>

                                {/* List Features */}
                                <ul className="list-disc pl-5 mt-4">
                                    {service.features.map((feat, i) => (
                                        <li key={i}>{feat}</li>
                                    ))}
                                </ul>


                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-4 items-center">
                                    <button className="flex items-center gap-1 px-4 py-1 border border-custom-blue text-custom-blue transition-all duration-200 ease-in-out hover:bg-custom-orange hover:text-white hover:border-transparent active:bg-custom-orange active:text-white active:border-transparent">
                                        <PenTool size={16} /> Add Review
                                    </button>
                                    <button className="flex items-center gap-1 px-4 py-1 border border-custom-blue text-custom-blue transition-all duration-200 ease-in-out hover:bg-custom-orange hover:text-white hover:border-transparent active:bg-custom-orange active:text-white active:border-transparent">
                                        <Camera size={16} /> Upload Photo
                                    </button>
                                    <button className="flex items-center gap-1 px-4 py-1 border border-custom-blue text-custom-blue transition-all duration-200 ease-in-out hover:bg-custom-orange hover:text-white hover:border-transparent active:bg-custom-orange active:text-white active:border-transparent">
                                        <Import size={16} /> Save
                                    </button>
                                    <button className="flex items-center gap-1 px-4 py-1 border border-custom-blue text-custom-blue transition-all duration-200 ease-in-out hover:bg-custom-orange hover:text-white hover:border-transparent active:bg-custom-orange active:text-white active:border-transparent">
                                        <Share2 size={16} /> Share
                                    </button>
                                </div>


                            </div>
                        </div>

                    </div>

                    {/* Right - Booking Form */}
                    <aside className="space-y-6">
                        <div className="border rounded-lg p-4 pt-0 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4 heading">Schedule a Booking</h3>
                            <form className="space-y-3">
                                <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
                                <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
                                <input type="tel" placeholder="Phone" className="w-full p-2 border rounded" />

                                <div className="space-y-1">
                                    <p>What type of service do you need?</p>
                                    {service.services.map((svc) => (
                                        <label key={svc.id} className="block">
                                            <input type="radio" name="service" value={svc.name} /> {svc.name}
                                        </label>
                                    ))}
                                </div>

                                <button className="w-full bg-custom-blue text-white p-2 rounded hover:bg-teal-700">
                                    Request an Appointment
                                </button>
                            </form>

                        </div>
                        {/* Contact Info */}
                        <div className="border-b-2 border-t-2 border-gray-300 p-4 shadow-sm">
                            <h3 className="text-lg font-semibold heading">Contact Us</h3>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-full bg-custom-orange p-2">
                                    <PhoneCall size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-sm text-gray-800">
                                    <span className="font-medium text-custom-orange leading-tight m-0 p-0">Call Us:</span>
                                    <span className="m-0 p-0 leading-tight">{service.contact.phone}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-full bg-custom-orange p-2">
                                    <Mail size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-sm text-gray-800">
                                    <span className="font-medium text-custom-orange leading-tight m-0 p-0">Email Us:</span>
                                    <span className="m-0 p-0 leading-tight">{service.contact.email}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-full bg-custom-orange p-2">
                                    <MapPin size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-sm text-gray-800">
                                    <span className="font-medium text-custom-orange leading-tight m-0 p-0">Address:</span>
                                    <span className="m-0 p-0 leading-tight">{service.contact.address}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-full bg-custom-orange p-2">
                                    <Globe size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col text-sm text-gray-800">
                                    <span className="font-medium text-custom-orange leading-tight m-0 p-0">Website:</span>
                                    <span className="m-0 p-0 leading-tight">{service.contact.website}</span>
                                </div>
                            </div>

                        </div>
                    </aside>


                    {/* Rest of Content */}
                    <div className="md:col-span-2 space-y-12 mt-8">
                        {/* Title & Meta */}


                        {/* Photo Gallery */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2 heading">Photo Gallery</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {service.galleryImages.map((img, i) => (
                                    <div key={i} className="relative w-full aspect-square rounded overflow-hidden">
                                        <img
                                            src={img}
                                            alt={`Gallery Image ${i + 1}`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>


                        {/* Location + Hours */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 heading">Location and Hours</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                {/* Business Hours */}
                                <div className="bg-gray-50 border rounded-lg p-4 shadow-sm text-sm text-gray-800 space-y-1">
                                    {service.businessHours.map(({ day, hours }) => (
                                        <div key={day} className="flex justify-between items-center border-b last:border-b-0 pb-1">
                                            <span className="font-medium tracking-wide w-1/2">{day}</span>
                                            <span className="w-1/2 text-right">{hours}</span>
                                        </div>
                                    ))}

                                </div>

                                {/* Map */}
                                <div className="rounded-lg overflow-hidden shadow-sm mt-2 md:mt-0">
                                    <iframe
                                        title="Service Location"
                                        src={service.locationMapEmbedUrl}
                                        width="100%"
                                        height="260"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                            <div className="mt-5">
                                <button className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-all font-medium">
                                    Get Directions
                                </button>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2 heading">Amenities</h2>
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
                            <h2 className="text-xl font-semibold mb-2 heading">FAQ</h2>
                            {service.faq.map((item, i) => (
                                <details key={i} className="mb-2 border p-3 rounded">
                                    <summary className="font-semibold cursor-pointer">{item.question}</summary>
                                    <p className="mt-2 text-gray-700">{item.answer}</p>
                                </details>
                            ))}

                        </div>

                        {/* Reviews */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2 heading">Review Highlights</h2>
                            {service.reviews.slice(0, visibleCount).map((review, i) => (
                                <div key={i} className="border rounded p-4 mb-3">
                                    <div className="flex gap-3">
                                        {review.image ? (
                                            <div className="w-10 h-10 relative rounded-full overflow-hidden">
                                                <Image
                                                    src={review.image}
                                                    alt={review.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <CircleUserRound className="text-gray-400 w-10 h-10" />
                                        )}

                                        <div className="flex flex-col justify-center">
                                            <p className="font-bold leading-none roboto">{review.name}</p>
                                            <p className="text-xs text-gray-500 leading-tight">{review.role}</p>
                                            <p className="text-yellow-500 text-sm leading-tight">
                                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-1">{review.comment}</p>
                                </div>
                            ))}

                            {/* Show button only if there are more than 4 reviews */}
                            {service.reviews.length > 4 && (
                                <div className="text-center">
                                    <button
                                        className="text-custom-orange hover:underline mt-2 font-bold"
                                        onClick={() => setShowAll(!showAll)}
                                    >
                                        {showAll ? "Show Less" : "View More +"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

            </main>
            <FeatureBlogs />
        </>
    );
};

export default ServiceDetailPage;
