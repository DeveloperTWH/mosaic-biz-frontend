import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, ShoppingBag, Users, Briefcase, BookOpen } from 'lucide-react';

export default function HowToUseApp() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative w-full h-[300px] bg-[#1a1a1a]">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: "url('/how-to-use/banner.png')" }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide">HOW TO USE THIS APP</h1>
                    <p className="text-lg text-white font-medium">Home // How To Use This App</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto w-full px-6 py-12 lg:px-12">
                
                {/* Tagline Section */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        Shop With Purpose. Sell With Power. Connect With Community.
                    </h2>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Whether you're a conscious consumer or a verified vendor, Mosaic Biz Hub makes it easy to discover, support, and grow with minority-owned businesses across the country. Here's how to make the most of your experience:
                    </p>
                </div>

                {/* Step 1 - Browse & Discover (Text Left, Image Right) */}
                <div className="flex flex-col md:flex-row mb-0">
                    <div className="md:w-1/2 bg-[#F5F0E6] p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye size={24} className="text-[#C7A040]" />
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                1. Browse & Discover
                            </h3>
                        </div>

                        <ul className="space-y-4 text-sm text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Explore by Category:
                                    </span>{" "}
                                    Navigate through curated categories like Salons & Spas, Legal Services, 
                                    Health & Wellness, Business Consulting, IT, Marketing, and more.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Filter by Identity & Location:
                                    </span>{" "}
                                    Use filters to find businesses by minority group (e.g., African-American, 
                                    LatinX, Woman, Veteran) and geographic location (e.g., New York City, 
                                    Atlanta, Virginia Beach).
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Search with Purpose:
                                    </span>{" "}
                                    Use the search bar to find specific products, services, or vendor names.
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 relative h-[300px] md:h-auto bg-gray-200">
                        <Image src="/how-to-use/Mask group.png" alt="Browse & Discover" fill className="object-cover" />
                    </div>
                </div>

                {/* Step 2 - Shop & Support (Image Left, Text Right) */}
                <div className="flex flex-col md:flex-row-reverse mb-0">
                    <div className="md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <ShoppingBag size={24} className="text-[#C7A040]" />
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                2. Shop & Support
                            </h3>
                        </div>

                        <ul className="space-y-4 text-sm text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        View Featured Products & Services:
                                    </span>{" "}
                                    Discover top-rated listings based on vendor tier and customer feedback.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Click to Learn More:
                                    </span>{" "}
                                    Each listing includes photos, descriptions, pricing, and verified reviews.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Request a Quote:
                                    </span>{" "}
                                    For service-based businesses, use the built-in form to request custom quotes directly.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Add to Wishlist:
                                    </span>{" "}
                                    Save your favorite vendors and products for easy access later.
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 relative h-[300px] md:h-[350px] bg-gray-200">
                        <Image src="/how-to-use/Mask group (1).png" alt="Shop & Support" fill className="object-cover" />
                    </div>
                </div>

                {/* Step 3 - Connect With Vendors (Text Left, Image Right) */}
                <div className="flex flex-col md:flex-row mb-0">
                    <div className="md:w-1/2 bg-[#F5F0E6] p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <Users size={24} className="text-[#C7A040]" />
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                3. Connect With Vendors
                            </h3>
                        </div>

                        <ul className="space-y-4 text-sm text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        In-App Messaging:
                                    </span>{" "}
                                    Communicate directly with vendors through secure web and mobile messaging.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Follow Vendors:
                                    </span>{" "}
                                    Stay updated on new products, promotions, and events via push notifications.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Leave Verified Reviews:
                                    </span>{" "}
                                    Share your experience and help others shop with confidence.
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 relative h-[300px] md:h-[350px] bg-gray-200">
                        <Image src="/how-to-use/Mask group (2).png" alt="Connect With Vendors" fill className="object-cover" />
                    </div>
                </div>

                {/* Step 4 - Become A Vendor (Image Left, Text Right) */}
                <div className="flex flex-col md:flex-row-reverse mb-0">
                    <div className="md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Briefcase size={24} className="text-[#C7A040]" />
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                4. Become A Vendor
                            </h3>
                        </div>

                        <ul className="space-y-4 text-sm text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Register Your Business:
                                    </span>{" "}
                                    Start by completing a quick vendor application and paying the one-time $24.99 verification fee.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Choose Your Tier:
                                    </span>{" "}
                                    Select from Silver, Gold, or Platinum plans based on your business goals and growth stage.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Set Up Your Profile:
                                    </span>{" "}
                                    Add your logo, business story, products/services, images, and contact info.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Launch & Grow:
                                    </span>{" "}
                                    Use built-in tools like promotions, analytics, CRM, and loyalty integration to scale your reach and revenue.
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 relative h-[300px] md:h-[350px] bg-gray-200">
                        <Image src="/how-to-use/2149241375 1.png" alt="Become A Vendor" fill className="object-cover" />
                    </div>
                </div>

                {/* Step 5 - Access Resources & Support (Text Left, Image Right) */}
                <div className="flex flex-col md:flex-row mb-16">
                    <div className="md:w-1/2 bg-[#F5F0E6] p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen size={24} className="text-[#C7A040]" />
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                5. Access Resources & Support
                            </h3>
                        </div>

                        <ul className="space-y-4 text-sm text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Vendor Resource Library:
                                    </span>{" "}
                                    Download templates, legal guides, pricing tools, and marketing checklists.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Video Onboarding:
                                    </span>{" "}
                                    Learn how to optimize your listings and use platform features effectively.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-[#C7A040] font-bold mt-1">•</span>
                                <span>
                                    <span className="font-semibold text-gray-900">
                                        Live Support & Strategy Calls:
                                    </span>{" "}
                                    Platinum vendors receive quarterly coaching to refine their growth strategy.
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 relative h-[300px] md:h-[350px] bg-gray-200">
                        <Image src="/how-to-use/2149241375 1 (1).png" alt="Resources & Support" fill className="object-cover" />
                    </div>
                </div>

                {/* Trusted By Section */}
                <div className="text-center mb-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 uppercase tracking-wide">Trusted By Business Owners</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-left">
                            <div className="text-4xl text-[#C7A040] mb-3 font-serif">"</div>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                I have been using Mosaic Biz Hub for the past 6 months and it has completely transformed my business. The platform is easy to use and the support team is always there to help.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                                    JD
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">John Doe</p>
                                    <p className="text-xs text-gray-500">CEO & Founder</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-left">
                            <div className="text-4xl text-[#C7A040] mb-3 font-serif">"</div>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                The resources and support available are incredible. I've been able to connect with vendors who share my values and grow my business exponentially.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                                    JS
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">Jane Smith</p>
                                    <p className="text-xs text-gray-500">Creative Director</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-left">
                            <div className="text-4xl text-[#C7A040] mb-3 font-serif">"</div>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                Connecting with vendors who share my values has been game-changing. The platform has helped me reach new customers and expand my business.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                                    MJ
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">Mike Johnson</p>
                                    <p className="text-xs text-gray-500">Small Business Owner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expand Your Reach Section - Full Width */}
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