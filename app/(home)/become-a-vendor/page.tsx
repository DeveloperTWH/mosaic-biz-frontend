import React from 'react';
import HeroSection from '../services/components/HeroSection';
import { Mail, MapPinned, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function ContactUsPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <HeroSection heading="Become a Vendor" imageUrl="/become-a-vendor/become-a-vendor.jpg" />

            {/* Contact Form & Newsletter */}
            <div className="flex flex-col justify-center w-full p-6 mx-auto bg-pink-100 lg:p-12 max-w-7xl">
                <p className='font-bold text-center'>Become a Vendor</p>

                <Link href={"/signup?type=vendor"} className="px-5 py-2 mt-5 mb-5 font-semibold text-center text-blue-400 transition bg-transparent border border-blue-400 hover:bg-white hover:text-blue-700">
                    Become A Vendor
                </Link>
            </div>
        </div>
    );
}

// Tailwind input class shortcut
const input = `bg-gray-900 border border-gray-300  p-2 focus:outline-none focus:ring-2 focus:ring-orange-500`;
