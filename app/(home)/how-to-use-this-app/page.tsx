"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicPageHero from '../Components/PublicPageHero';
import VendorExpandCta from '../Components/VendorExpandCta';

export default function HowToUseApp() {
    return (
        <div className="flex flex-col">
            <PublicPageHero
                title="How to Use This App"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "How to Use This App" },
                ]}
                imageUrl="/how-to-use/banner.png"
            />

            <div className="container-page py-12 sm:py-16">
                <div className="mb-12 text-center">
                    <h2 className="market-section-heading text-2xl sm:text-3xl">
                        Choose your path
                    </h2>
                    <div className="market-section-divider" />
                    <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm text-market-muted sm:text-base">
                        Whether you are shopping or selling, Mosaic Biz Hub connects you with verified minority-owned businesses.
                    </p>
                </div>

                <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <article className="market-card-light">
                        <h3 className="market-card-light-title mb-3">For shoppers</h3>
                        <ul className="market-card-light-body space-y-2 text-left">
                            <li>Browse products, services, and food</li>
                            <li>Filter by category and location</li>
                            <li>View trust badges before you buy</li>
                            <li>Checkout when listings support cart</li>
                        </ul>
                        <Link href="/products" className="market-btn-primary mt-6 inline-block">
                            Start shopping
                        </Link>
                    </article>
                    <article className="market-card-light">
                        <h3 className="market-card-light-title mb-3">For vendors</h3>
                        <ul className="market-card-light-body space-y-2 text-left">
                            <li>Apply and complete verification</li>
                            <li>Choose your tier and set up your profile</li>
                            <li>List products or services</li>
                            <li>Access vendor resources and support</li>
                        </ul>
                        <Link href="/become-a-vendor" className="market-btn-secondary mt-6 inline-block">
                            Become a vendor
                        </Link>
                    </article>
                </div>

                <div className="mb-12 text-center">
                    <h2 className="font-poppins text-xl font-semibold text-market-text sm:text-2xl">
                        Shop With Purpose. Sell With Power. Connect With Community.
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl font-montserrat text-sm leading-relaxed text-market-muted sm:text-base">
                        Follow the steps below to get the most from Mosaic Biz Hub today.
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
            Use platform tools to manage listings and grow your reach.
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

            {/* Vendor stories — coming soon */}
            <div className="w-full bg-market-surface py-16">
                <div className="market-card mx-auto max-w-2xl p-8 text-center">
                    <h3 className="market-section-heading text-xl">Vendor stories coming soon</h3>
                    <div className="market-section-divider" />
                    <p className="mt-4 font-montserrat text-sm text-market-muted">
                        We are collecting real vendor stories for this section. Browse the marketplace or apply to become a vendor today.
                    </p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/vendors" className="market-btn-secondary min-w-[180px]">Browse vendors</Link>
                        <Link href="/become-a-vendor" className="market-btn-primary min-w-[180px]">Become a vendor</Link>
                    </div>
                </div>
            </div>

            <VendorExpandCta />
        </div>
    );
}