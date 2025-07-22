"use client";

import { useBusinessStore } from "@/app/store/businessStore";
import { fetchBusinessBySlug } from "../utils/fetchBusiness";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LoadingPage from "../components/LoadingPage";
import NotFoundPage from "../components/NotFoundPage";
import { SquarePen, ImagePlus } from "lucide-react";
import Image from "next/image";

const Page = () => {
    const { businessid } = useParams();
    const { business, setBusiness, clearBusiness } = useBusinessStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [profile, setProfile] = useState<any>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const session = localStorage.getItem("user_session");
        setIsLoggedIn(session === 'true');

        const userGender = localStorage.getItem("user_gender");
        setGender(userGender);
    }, []);

    useEffect(() => {

        setProfile({
                    firstName: "Marlin",
                    lastName: "Doe",
                    email: "marlindoe@gmail.com",
                    contactNumber: "123 456 7890",
                    language: "English",
                    minorityType: "Indian",
                    address: {
                        addressLine: "Lorem Ipsum Dolor Sit Amet",
                        city: "Toronto",
                        country: "Canada",
                        postalCode: "M5V 3L9",
                    },
                });
                
        if (!businessid) return;

        const loadBusiness = async () => {
            setIsLoading(true);
            try {
                if (business && business.slug === businessid) return;
                if (business && business.slug !== businessid) clearBusiness();

                const fetchedBusiness = await fetchBusinessBySlug(businessid as string);
                setBusiness(fetchedBusiness);

                setProfile({
                    firstName: "Marlin",
                    lastName: "Doe",
                    email: "marlindoe@gmail.com",
                    contactNumber: "123 456 7890",
                    language: "English",
                    minorityType: "Indian",
                    address: {
                        addressLine: "Lorem Ipsum Dolor Sit Amet",
                        city: "Toronto",
                        country: "Canada",
                        postalCode: "M5V 3L9",
                    },
                });
            } catch (error) {
                console.error("Error loading business:", error);
                setError("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        loadBusiness();
    }, [businessid]);

    if (isLoading) return <LoadingPage />;
    if (error) return <NotFoundPage />;

    return (
        <div className="flex h-screen bg-[#EBEAE2]">
            <Sidebar
                businessName={business?.businessName}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar setIsSidebarOpen={setIsSidebarOpen} />

                <main className="flex-1 p-4 space-y-6 overflow-y-auto lg:p-6">
                    <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Side */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Personal Info */}
                            <section className="p-4 bg-white rounded-lg shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold heading">Personal Information</h2>
                                    <button className="flex gap-2 text-sm text-blue-600 hover:underline text-[14px] items-center"><SquarePen size={14} /> Edit</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                    <p><strong>First Name :</strong> {profile?.firstName}</p>
                                    <p><strong>Last Name :</strong> {profile?.lastName}</p>
                                    <p><strong>Email Address :</strong> {profile?.email}</p>
                                    <p><strong>Contact Number :</strong> {profile?.contactNumber}</p>
                                    <p><strong>Language :</strong> {profile?.language}</p>
                                    <p><strong>Minority Type :</strong> {profile?.minorityType}</p>
                                </div>
                            </section>

                            {/* Address */}
                            <section className="p-4 bg-white rounded-lg shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold heading">Address</h2>
                                    <button className="flex gap-2 text-sm text-blue-600 hover:underline text-[14px] items-center"><SquarePen size={14} /> Edit</button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                    <p><strong>Address :</strong> {profile?.address.addressLine}</p>
                                    <p><strong>City :</strong> {profile?.address.city}</p>
                                    <p><strong>Country :</strong> {profile?.address.country}</p>
                                    <p><strong>Postal Code :</strong> {profile?.address.postalCode}</p>
                                </div>
                            </section>

                            {/* Business Info */}
                            <section className="p-4 bg-white rounded-lg shadow">
                                <h2 className="pb-2 mb-4 text-lg font-semibold border-b heading">Business Information</h2>

                                {/* Inner Card */}
                                <div className="flex flex-col md:flex-row p-4 bg-[#FAFAFA] border rounded-lg">
                                    {/* Left Side */}
                                    <div className="flex flex-col items-center justify-between w-full text-center border-r md:w-1/4 md:pr-4">
                                        {/* Logo */}
                                        <div className="relative flex flex-col items-center">
                                            {business?.logo ? (
                                                <img
                                                    src={business.logo}
                                                    alt={business.businessName}
                                                    className="object-contain w-16 h-16 border"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-gray-700 bg-gray-200 rounded-full">
                                                    {business?.businessName?.[0] || "B"}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-center mt-2 text-sm text-custom-yellow">
                                                ★★★★☆
                                                {/* <span className="ml-1 text-gray-600">{business?.rating || 4.5}</span> */}
                                                <span className="ml-1 text-gray-600">{4.5}</span>
                                            </div>
                                        </div>

                                        {/* Rating */}

                                        {/* Edit Business Button */}
                                        <button className="flex items-center gap-1 px-3 py-1 mt-4 text-sm text-white bg-orange-500 rounded hover:bg-orange-600">
                                            <SquarePen className="w-4 h-4" />
                                            <span>Edit Business</span>
                                        </button>
                                    </div>

                                    {/* Right Side - Business Details */}
                                    <div className="w-full mt-4 space-y-2 text-sm md:w-3/4 md:pl-4 md:mt-0">
                                        <p><strong>Business Name</strong> : {business?.businessName}</p>
                                        <p><strong>Description</strong> : {business?.description}</p>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <p><strong>Licence Number</strong> : {business?.slug}</p>
                                            <p><strong>Business Type</strong> : {business?.listingType}</p>
                                            <p><strong>Business Email Address</strong> : {business?.email}</p>
                                            <p><strong>Business Contact Number</strong> : {business?.phone}</p>
                                            <p><strong>Address</strong> : {business?.address.street}</p>
                                            <p><strong>City</strong> : {business?.address.city}</p>
                                            <p><strong>State</strong> : {business?.address.state}</p>
                                            <p><strong>Country</strong> : {business?.address.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>


                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button className="px-4 py-2 text-white bg-orange-600 rounded hover:bg-orange-700">
                                    Save Changes
                                </button>
                                <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                                    Delete Profile
                                </button>
                            </div>
                        </div>

                        {/* Right Side Profile Card */}
                        <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow">
                            <div className="relative">
                                <div className="p-[2px] rounded-full bg-white border border-custom-blue">
                                    <Image
                                        src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
                                        width={80}
                                        height={80}
                                        alt="Profile"
                                        className="border border-gray-300 rounded-full"
                                    />
                                </div>
                            </div>
                            <h3 className="mt-3 text-lg font-semibold">
                                {profile?.firstName} {profile?.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{profile?.email}</p>
                            <p className="text-sm text-gray-600">
                                {profile?.address.city}, {profile?.address.country}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Page;
