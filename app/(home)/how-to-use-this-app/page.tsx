"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicPageHero from '../Components/PublicPageHero';
import VendorExpandCta from '../Components/VendorExpandCta';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
    {
        id: 1,
        quote: "I have been using Mosaic Biz Hub for the past 6 months and it has completely transformed my business. The platform is easy to use and the support team is always there to help.",
        name: "John Doe",
        role: "CEO Of ABC Salon",
        // avatar: "/testimonials/john-doe.jpg"
    },
    {
        id: 2,
        quote: "The resources and support available are incredible. I've been able to connect with vendors who share my values and grow my business exponentially.",
        name: "Jane Smith",
        role: "Creative Director",
        // avatar: "/testimonials/jane-smith.jpg"
    },
    {
        id: 3,
        quote: "Connecting with vendors who share my values has been game-changing. The platform has helped me reach new customers and expand my business.",
        name: "Mike Johnson",
        role: "Small Business Owner",
        // avatar: "/testimonials/mike-johnson.jpg"
    },
    {
        id: 4,
        quote: "Mosaic Biz Hub has been instrumental in helping us scale our operations. The visibility and connections we've made are invaluable.",
        name: "Sarah Williams",
        role: "Founder & CEO",
        // avatar: "/testimonials/sarah-williams.jpg"
    },
    {
        id: 5,
        quote: "An amazing platform that truly understands the needs of minority-owned businesses. Highly recommend to anyone looking to grow their brand.",
        name: "David Chen",
        role: "Marketing Director",
        avatar: "/testimonials/david-chen.jpg"
    }
];

export default function HowToUseApp() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <PublicPageHero
                title="How to Use This App"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "How to Use This App" },
                ]}
                imageUrl="/how-to-use/banner.png"
            />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto w-full px-6 py-12 lg:px-12">
                
                {/* Tagline Section */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        Shop With Purpose. Sell With Power. Connect With Community.
                    </h2>
                 <p className="font-montserrat font-[500] text-base leading-[28px] text-gray-600 text-center capitalize">
  Whether you're a conscious consumer or a verified vendor, Mosaic Biz Hub makes it easy to discover, support, and grow with minority-owned businesses across the country. Here's how to make the most of your experience:
</p>
                </div>
            </div>

            {/* Step 1 - Browse & Discover (Full Width) */}
<div className="flex flex-col md:flex-row mb-0 w-full">
  <div className="md:w-1/2 bg-[#F5F0E6] p-8 md:p-16 flex flex-col justify-center">
    <div className="max-w-xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-montserrat font-[700] text-gray-900 uppercase tracking-wide">
          1.Browse & Discover
        </h3>
      </div>

      {/* Double line separator */}
      <div className="mb-8">
        <div className="w-24 h-0.5 bg-gray-400 mb-1"></div>
        <div className="w-24 h-0.5 bg-gray-400"></div>
      </div>

      <ul className="space-y-6 text-sm text-gray-700 font-montserrat font-[500]">
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-bold mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">
              Explore By Category:
            </span>{" "}
            Navigate Through Curated Categories Like Salons & Spas, Legal Services, 
            Health & Wellness, Business Consulting, IT, Marketing, And More.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-bold mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">
              Filter By Identity & Location:
            </span>{" "}
            Use Filters To Find Businesses By Minority Group (E.G., 
            African-American, LatinX, Woman, Veteran) And Geographic Location (E.G., New York 
            City, Atlanta, Virginia Beach).
          </span>
        </li>

        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-bold mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">
              Search With Purpose:
            </span>{" "}
            Use The Search Bar To Find Specific Products, Services, Or Vendor Names.
          </span>
        </li>
      </ul>
    </div>
  </div>

  <div className="md:w-1/2 relative h-[400px] md:h-[500px]">
    <Image src="/how-to-use/Mask group.png" alt="Browse & Discover" fill className="object-cover" />
  </div>
</div>

            {/* Step 2 - Shop & Support (Full Width) */}
         <div className="flex flex-col md:flex-row-reverse mb-0 w-full">
  <div className="md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center border-t border-b border-gray-100">
    <div className="max-w-xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-montserrat font-[700] text-gray-900 uppercase tracking-wide">
          2. Shop & Support
        </h3>
      </div>

      <ul className="space-y-6 text-sm text-gray-700 font-montserrat font-[500] leading-7 tracking-normal">
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">
              View Featured Products & Services:
            </span>{" "}
            Discover top-rated listings based on vendor tier and customer feedback.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">
              Click to Learn More:
            </span>{" "}
            Each listing includes photos, descriptions, pricing, and verified reviews.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">
              Request a Quote:
            </span>{" "}
            For service-based businesses, use the built-in form to request custom quotes directly.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">
              Add to Wishlist:
            </span>{" "}
            Save your favorite vendors and products for easy access later.
          </span>
        </li>
      </ul>
    </div>
  </div>

  <div className="md:w-1/2 relative h-[400px] md:h-[500px]">
    <Image src="/how-to-use/Mask group (1).png" alt="Shop & Support" fill className="object-cover" />
  </div>
</div>

            {/* Step 3 - Connect With Vendors (Full Width) */}
<div className="flex flex-col md:flex-row mb-0 w-full">
  <div className="md:w-1/2 bg-[#F5F0E6] p-8 md:p-16 flex flex-col justify-center">
    <div className="max-w-xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-montserrat font-[700] text-gray-900 uppercase tracking-wide">
          3. Connect With Vendors
        </h3>
      </div>

      <ul className="space-y-6 text-sm text-gray-700 font-montserrat font-[500] leading-7 tracking-normal">
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">In-App Messaging:</span>{" "}
            Communicate directly with vendors through secure web and mobile messaging.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Follow Vendors:</span>{" "}
            Stay updated on new products, promotions, and events via push notifications.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Leave Verified Reviews:</span>{" "}
            Share your experience and help others shop with confidence.
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div className="md:w-1/2 relative h-[400px] md:h-[500px]">
    <Image src="/how-to-use/Mask group (2).png" alt="Connect With Vendors" fill className="object-cover" />
  </div>
</div>

            {/* Step 4 - Become A Vendor (Full Width) */}
<div className="flex flex-col md:flex-row-reverse mb-0 w-full">
  <div className="md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center border-t border-b border-gray-100">
    <div className="max-w-xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-montserrat font-[700] text-gray-900 uppercase tracking-wide">
          4. Become A Vendor
        </h3>
      </div>

      <ul className="space-y-6 text-sm text-gray-700 font-montserrat font-[500] leading-7 tracking-normal">
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Register Your Business:</span>{" "}
            Start by completing a quick vendor application and paying the one-time $24.99 verification fee.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Choose Your Tier:</span>{" "}
            Select from Silver, Gold, or Platinum plans based on your business goals and growth stage.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Set Up Your Profile:</span>{" "}
            Add your logo, business story, products/services, images, and contact info.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Launch & Grow:</span>{" "}
            Use built-in tools like promotions, analytics, CRM, and loyalty integration to scale your reach and revenue.
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div className="md:w-1/2 relative h-[400px] md:h-[500px]">
    <Image src="/how-to-use/2149241375 1.png" alt="Become A Vendor" fill className="object-cover" />
  </div>
</div>

            {/* Step 5 - Access Resources & Support (Full Width) */}
<div className="flex flex-col md:flex-row mb-16 w-full">
  <div className="md:w-1/2 bg-[#F5F0E6] p-8 md:p-16 flex flex-col justify-center">
    <div className="max-w-xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-montserrat font-[700] text-gray-900 uppercase tracking-wide">
          5. Access Resources & Support
        </h3>
      </div>

      <ul className="space-y-6 text-sm text-gray-700 font-montserrat font-[500] leading-7 tracking-normal">
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Vendor Resource Library:</span>{" "}
            Download templates, legal guides, pricing tools, and marketing checklists.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Video Onboarding:</span>{" "}
            Learn how to optimize your listings and use platform features effectively.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-[#C7A040] font-[700] mt-1">•</span>
          <span>
            <span className="font-[700] text-gray-900">Live Support & Strategy Calls:</span>{" "}
            Platinum vendors receive quarterly coaching to refine their growth strategy.
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div className="md:w-1/2 relative h-[400px] md:h-[500px]">
    <Image src="/how-to-use/2149241375 1 (1).png" alt="Resources & Support" fill className="object-cover" />
  </div>
</div>

            {/* Trusted By Section - Carousel */}
            <div className="w-full bg-gray-50 py-16">
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">Trusted By Business Owners</h3>
                    <div className="flex justify-center mt-4">
                        <div className="w-16 h-0.5 bg-gray-300"></div>
                    </div>
                </div>
                
                <div className="max-w-4xl mx-auto px-6">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="testimonial-swiper"
                    >
                        {testimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id}>
                                <div className="bg-white rounded-lg p-10 md:p-12 shadow-sm">
                                    {/* Quote Icon */}
                                    <div className="mb-6">
                                        <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 32V19.2C0 15.2533 0.96 11.7333 2.88 8.64C4.8 5.54667 7.46667 2.98667 10.88 0.96L15.04 6.72C12.3733 8.32 10.24 10.2933 8.64 12.64C7.04 14.9867 6.24 17.3867 6.24 19.84V32H0ZM24 32V19.2C24 15.2533 24.96 11.7333 26.88 8.64C28.8 5.54667 31.4667 2.98667 34.88 0.96L39.04 6.72C36.3733 8.32 34.24 10.2933 32.64 12.64C31.04 14.9867 30.24 17.3867 30.24 19.84V32H24Z" fill="#C7A040"/>
                                        </svg>
                                    </div>
                                    
                                    {/* Quote Text */}
                                    <p className="text-gray-700 text-base leading-relaxed mb-8">
                                        {testimonial.quote}
                                    </p>
                                    
                                    {/* Divider */}
                                    <div className="w-full h-px bg-gray-200 mb-6"></div>
                                    
                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                            {testimonial.avatar ? (
                                                <Image 
                                                    src={testimonial.avatar} 
                                                    alt={testimonial.name}
                                                    width={56}
                                                    height={56}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-gray-600 text-sm font-bold">
                                                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                                            <p className="text-[#C7A040] text-sm font-medium">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <VendorExpandCta />
        </div>
    );
}