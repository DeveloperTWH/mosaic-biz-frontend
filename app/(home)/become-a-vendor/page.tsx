import React from 'react';
import { Mail, MapPinned, PhoneCall, CheckCircle, FileText, Video, HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';

export default function ContactUsPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            {/* <HeroSection heading="Become a Vendor" imageUrl="/become-a-vendor/become-a-vendor.jpg" /> */}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto w-full px-6 py-16 lg:px-12">
                
                {/* How It Works Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-4">How to Become a Vendor</h2>
                    <hr className="h-[2px] w-[100px] bg-[#C7A040] mx-auto mb-2" />
                    <hr className="h-[2px] w-[100px] bg-[#C7A040] mx-auto mb-8" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        {/* Step 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="bg-[#C7A040] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                            <h3 className="text-xl font-bold mb-2">Register Your Business</h3>
                            <p className="text-gray-600">Start by completing a quick vendor application and paying the one-time <span className="font-semibold">$24.99 verification fee</span>.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="bg-[#C7A040] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                            <h3 className="text-xl font-bold mb-2">Choose Your Tier</h3>
                            <p className="text-gray-600">Select from Silver, Gold, or Platinum plans based on your business goals and growth stage.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="bg-[#C7A040] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                            <h3 className="text-xl font-bold mb-2">Set Up Your Profile</h3>
                            <p className="text-gray-600">Add your logo, business story, products/services, images, and contact info.</p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="bg-[#C7A040] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
                            <h3 className="text-xl font-bold mb-2">Launch & Grow</h3>
                            <p className="text-gray-600">Use built-in tools like promotions, analytics, CRM, and loyalty integration to scale your reach and revenue.</p>
                        </div>
                    </div>
                </div>
                {/* Resources & Support Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-4">Resources & Support</h2>
                    <hr className="h-[2px] w-[100px] bg-[#C7A040] mx-auto mb-2" />
                    <hr className="h-[2px] w-[100px] bg-[#C7A040] mx-auto mb-8" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {/* Vendor Resource Library */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                            <div className="bg-[#C7A040]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={32} className="text-[#C7A040]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Vendor Resource Library</h3>
                            <p className="text-gray-600">Download templates, legal guides, pricing tools, and marketing checklists to help your business thrive.</p>
                        </div>

                        {/* Video Onboarding */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                            <div className="bg-[#C7A040]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Video size={32} className="text-[#C7A040]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Video Onboarding</h3>
                            <p className="text-gray-600">Learn how to optimize your listings and use platform features effectively with our step-by-step video guides.</p>
                        </div>

                        {/* Live Support & Strategy Calls */}
                        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                            <div className="bg-[#C7A040]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HeadphonesIcon size={32} className="text-[#C7A040]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Live Support & Strategy Calls</h3>
                            <p className="text-gray-600">Platinum vendors receive quarterly coaching to refine their growth strategy. All tiers get access to our support team.</p>
                        </div>
                    </div>

                    {/* Additional Support Info */}
                    <div className="mt-8 bg-blue-50 p-6 rounded-lg text-center">
                        <p className="text-gray-700">
                            <span className="font-bold">All vendors receive:</span> Access to our support team, community forums, and regular webinars to help you succeed.
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link 
                        href="/signup?type=vendor" 
                        className="inline-block px-10 py-4 bg-[#C7A040] text-white font-bold text-lg rounded-lg hover:bg-[#b38f3a] transition-colors shadow-lg hover:shadow-xl"
                    >
                        Become A Vendor Today
                    </Link>
                    <p className="text-gray-500 mt-3 text-sm">One-time $24.99 verification fee applies</p>
                </div>
            </div>

            {/* Expand Your Reach Section - Full Width with Increased Height */}
            <div className="relative left-1/2 right-1/2 w-screen ml-[-50vw] mr-[-50vw] mt-12 mb-8">
                <div 
                    className="w-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
                >
                    <div className="bg-[#3333339E] py-24 px-8 text-center text-white">
                        <div className="max-w-[900px] mx-auto">
                            <h2 className="text-white text-3xl font-bold mb-2">EXPAND YOUR REACH -</h2>
                            <h2 className="text-white text-3xl font-bold mb-4">LIST YOUR BUSINESS ON OUR PLATFORM!</h2>
                            
                            <hr className="h-[2px] w-[180px] bg-white border-none mx-auto my-4" />
                            <hr className="h-[2px] w-[180px] bg-white border-none mx-auto mb-8" />
                            
                            <p className="text-white text-lg leading-relaxed max-w-[700px] mx-auto mb-10 opacity-95">
                                Take your business to new heights by listing it on Mosaic Biz Hub. 
                                Connect with customers who value minority-owned brands, showcase your 
                                unique products and services, and grow your presence in the digital 
                                marketplace. Join a community dedicated to supporting your success 
                                every step of the way.
                            </p>
                            
                            <Link 
                                href="/become-a-vendor" 
                                className="inline-block px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-800"
                            >
                                Become A Vendor
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}