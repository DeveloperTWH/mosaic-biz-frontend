"use client"
import React, { useState } from "react";
import TopSellingProduct from "./component/TopSellingProduct";
import { Forward, Mail, MapPin, MessageSquareMore, Send, Star } from "lucide-react";
import ShareButton from "./component/ShareButton";
import TestShare from "./component/ShareButton";
import Overview from "./component/Overview";
import Offered from "./component/Offered";
import Ratings from "./component/Ratings";
const convertLatLngToPosition = (lat: number, lng: number) => {
    const mapWidth = 440;
    const mapHeight = 233;
    const x = ((lng + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { left: x, top: y };
};



const VendorDetailPage = () => {
    const vendor = {
        name: "Ray Ban",
        isTopVendor: true,
        description:
            "In hac habitasse platea dictumst. Cras at velit pulvinar, semper mi scelerisque, semper quam. Phasellus fermentum enim non porttitor accumsan.",
        contactOptions: ["Email", "Chat", "Share"],
        location: "USA",
        language: "English",
        pricingPlans: [
            { title: "Premium Plan", price: "$50.00 USD", selected: true },
            { title: "Bronze Plan", price: "$120.00 USD", selected: false },
            { title: "Gold Plan", price: "$120.00 USD", selected: false },
        ],
        mediaGallery: [
            "/vendor/banner.png",
            "/vendor/gal 1.png",
            "/vendor/gal 2.png",
            "/vendor/gal 3.png",
        ],
        services: [
            {
                title: "Services 01",
                items: [
                    "Delivery to 19000+ pin codes across India",
                    "Customer returns support",
                    "Logistics support from community warehouse available",
                ],
            },
            {
                title: "Services 02",
                items: ["Packaging", "Return Management"],
            },
            {
                title: "Services 03",
                items: ["Tracking", "Payment Gateway"],
            },
        ],
        onlineSales: 9589.88,
        bookingRate: 90,
        mapDots: [
            { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
            { city: "Porto Alegre", lat: -30.04043359687766, lng: -51.22522286521282 }, //-30.04043359687766, -51.22522286521282
            { city: "New York", lat: 40.7128, lng: -74.0060 },
            { city: "Los Angeles", lat: 34.0522, lng: -118.2437 },
            { city: "Paris", lat: 48.8566, lng: 2.3522 },
            { city: "Tokyo", lat: 35.6895, lng: 139.6917 },
            { city: "Sydney", lat: -33.8688, lng: 151.2093 },
        ],
        promotions: [
            { image: "/vendor/banner 2.png", title: "Summer Sale" },
            { image: "/vendor/banner 1.png", title: "Black Friday" },
        ],
        topSellingProducts: [
            { image: "/images/hoodie.jpg", title: "Hoodie", price: 499.0 },
            { image: "/images/sofa.jpg", title: "Sofa", price: 499.0 },
            { image: "/images/makeup.jpg", title: "Makeup", price: 499.0 },
            { image: "/images/headphones.jpg", title: "Headphones", price: 499.0 },
        ],
    };
    const [tab, setTab] = useState<number>(1);

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[38%] space-y-6">
                    <div className="bg-white shadow-md rounded-lg p-6 border-1 border-black">
                        <div className="flex flex-col my-10">
                            <div className="mx-auto w-24 h-24 rounded-full bg-red-500 text-white text-6xl flex items-center justify-center">
                                {vendor.name.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-bold mt-3 text-red-500 roboto text-center capitalize">{vendor.name}</h2>
                            {vendor.isTopVendor && (
                                <span className="text-sm  font-semibold text-center mb-10 roboto capitalize flex gap-2 justify-center items-center">Top Vendor <Star stroke="0" fill="yellow" size={20} /></span>
                            )}
                            <div className="flex justify-between">
                                <p className="text-custom-blue roboto underline">trusted partner</p>
                                <p className="text-custom-yellow roboto underline">trusted</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{vendor.description}</p>
                            <div className="flex gap-4 my-4 text-sm justify-between items-center">
                                <a href="mailto:vendor@example.com" className="text-gray-700">
                                    <div className="flex items-center gap-2 justify-center">
                                        <Mail /> Email
                                    </div>
                                </a>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Send /> Chat
                                </div>
                                <ShareButton />
                            </div>

                            <button className="mt-4 font-bold bg-gradient-to-r from-yellow-400 to-custom-blue text-white py-2 px-4 rounded">
                                Contact Vendor
                            </button>
                            <div className="mt-10 space-y-5 text-sm text-gray-600 justify-start">
                                <div className="flex justify-between">
                                    <div className="flex items-center">
                                        <MapPin />
                                        <p className="font-bold roboto text-lg">Location:</p>
                                    </div>
                                    <p className="font-bold roboto text-lg"> {vendor.location}</p>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center">
                                        <MessageSquareMore />
                                        <p className="font-bold roboto text-lg">Language:</p>
                                    </div>
                                    <p className="font-bold roboto text-lg"> {vendor.language}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Pricing Plan</h3>
                        <p className="text-sm text-gray-500 mb-4">No hidden fees, deposit requirements, or exclusivity clauses</p>
                        <div className="space-y-4">
                            {vendor.pricingPlans.map((plan, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-lg p-4 text-white ${plan.selected ? "bg-gradient-to-r from-cyan-500 to-teal-400" : "bg-yellow-600"
                                        }`}
                                >
                                    <h4 className="font-semibold">{plan.title}</h4>
                                    <p className="text-xl font-bold">{plan.price}</p>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>
                {/* overview start */}
                <div className="w-full md:w-[62%] space-y-5">
                    <div className="flex gap-6 border-b pb-2">
                        <button
                            className={`font-semibold ${tab === 1 ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`}
                            onClick={() => setTab(1)}
                        >
                            Overview
                        </button>
                        <button
                            className={`font-semibold ${tab === 2 ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`}
                            onClick={() => setTab(2)}
                        >
                            Offered
                        </button>
                        <button
                            className={`font-semibold ${tab === 3 ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-black"}`}
                            onClick={() => setTab(3)}
                        >
                            Ratings
                        </button>
                    </div>

                    {
                        tab === 1 && <Overview vendor={vendor} />
                    }
                    {
                        tab === 2 && <Offered/>
                    }
                    {
                        tab === 3 && <Ratings/>
                    }



                </div>
                {/* overview end make it seprate component */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendor.promotions.map((promo, idx) => (
                    <img key={idx} src={promo.image} alt={promo.title} className="" />
                ))}
            </div>
            <TopSellingProduct />
        </div>
    );
};

export default VendorDetailPage;