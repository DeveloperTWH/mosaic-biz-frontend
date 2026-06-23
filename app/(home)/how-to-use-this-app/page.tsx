"use client";

import React from 'react';
import Link from 'next/link';
import PublicPageHero from '../Components/PublicPageHero';
import VendorExpandCta from '../Components/VendorExpandCta';
import {
  MarketingPathCard,
  MarketingSectionHeader,
  MarketingStepSection,
} from '../Components/marketing/MarketingSections';

const shopperBullets = [
  'Browse products, services, and food',
  'Filter by category and location',
  'View trust badges before you buy',
  'Checkout when listings support cart',
];

const vendorBullets = [
  'Apply and complete verification',
  'Choose your tier and set up your profile',
  'List products or services',
  'Access vendor resources and support',
];

export default function HowToUseApp() {
  return (
    <div className="flex flex-col bg-market-bg">
      <PublicPageHero
        title="How to Use This App"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "How to Use This App" },
        ]}
        imageUrl="/how-to-use/banner.png"
      />

      <section className="public-section">
        <div className="container-page">
          <MarketingSectionHeader
            title="Choose your path"
            description="Whether you are shopping or selling, Mosaic Biz Hub connects you with verified minority-owned businesses."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MarketingPathCard
              title="For shoppers"
              bullets={shopperBullets}
              href="/products"
              ctaLabel="Start shopping"
              variant="primary"
            />
            <MarketingPathCard
              title="For vendors"
              bullets={vendorBullets}
              href="/become-a-vendor"
              ctaLabel="Become a vendor"
              variant="secondary"
            />
          </div>

          <div className="mt-12 text-center">
            <p className="font-poppins text-lg font-semibold text-market-text sm:text-xl">
              Shop with purpose. Sell with power. Connect with community.
            </p>
            <p className="mx-auto mt-3 max-w-2xl font-montserrat text-sm leading-relaxed text-market-muted sm:text-base">
              Follow the steps below to get the most from Mosaic Biz Hub today.
            </p>
          </div>
        </div>
      </section>

      <MarketingStepSection
        step={1}
        title="Browse & discover"
        imageSrc="/how-to-use/Mask group.png"
        imageAlt="Browse and discover on Mosaic Biz Hub"
        items={[
          {
            label: "Explore by category:",
            text: "Navigate curated categories like salons & spas, legal services, health & wellness, consulting, IT, marketing, and more.",
          },
          {
            label: "Filter by identity & location:",
            text: "Find businesses by minority group and geographic location that matter to you.",
          },
          {
            label: "Search with purpose:",
            text: "Use the search bar to find specific products, services, or vendor names.",
          },
        ]}
      />

      <MarketingStepSection
        step={2}
        title="Shop & support"
        imageSrc="/how-to-use/Mask group (1).png"
        imageAlt="Shop and support minority-owned businesses"
        reverse
        items={[
          {
            label: "View featured products & services:",
            text: "Discover top-rated listings based on vendor tier and customer feedback.",
          },
          {
            label: "Click to learn more:",
            text: "Each listing includes photos, descriptions, pricing, and verified reviews.",
          },
          {
            label: "Request a quote:",
            text: "For service-based businesses, use the built-in form to request custom quotes directly.",
          },
          {
            label: "Add to wishlist:",
            text: "Save favorite vendors and products for easy access later.",
          },
        ]}
      />

      <MarketingStepSection
        step={3}
        title="Connect with vendors"
        imageSrc="/how-to-use/Mask group (2).png"
        imageAlt="Connect with vendors on Mosaic Biz Hub"
        items={[
          {
            label: "In-app messaging:",
            text: "Communicate directly with vendors through secure web and mobile messaging.",
          },
          {
            label: "Follow vendors:",
            text: "Stay updated on new products, promotions, and events via notifications.",
          },
          {
            label: "Leave verified reviews:",
            text: "Share your experience and help others shop with confidence.",
          },
        ]}
      />

      <MarketingStepSection
        step={4}
        title="Become a vendor"
        imageSrc="/how-to-use/2149241375 1.png"
        imageAlt="Become a vendor on Mosaic Biz Hub"
        reverse
        items={[
          {
            label: "Register your business:",
            text: "Complete a quick vendor application and pay the one-time verification fee.",
          },
          {
            label: "Choose your tier:",
            text: "Select from Silver, Gold, or Platinum plans based on your business goals.",
          },
          {
            label: "Set up your profile:",
            text: "Add your logo, business story, products or services, images, and contact info.",
          },
          {
            label: "Launch & grow:",
            text: "Use platform tools to manage listings and grow your reach.",
          },
        ]}
      />

      <MarketingStepSection
        step={5}
        title="Access resources & support"
        imageSrc="/how-to-use/2149241375 1 (1).png"
        imageAlt="Vendor resources and support"
        items={[
          {
            label: "Vendor resource library:",
            text: "Download templates, legal guides, pricing tools, and marketing checklists.",
          },
          {
            label: "Video onboarding:",
            text: "Learn how to optimize listings and use platform features effectively.",
          },
          {
            label: "Live support & strategy calls:",
            text: "Platinum vendors receive quarterly coaching to refine their growth strategy.",
          },
        ]}
      />

      <section className="public-section bg-market-surface">
        <div className="container-page">
          <div className="market-card mx-auto max-w-2xl p-8 text-center sm:p-10">
            <MarketingSectionHeader
              title="Vendor stories coming soon"
              description="We are collecting real vendor stories for this section. Browse the marketplace or apply to become a vendor today."
              className="mb-0"
            />
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link href="/vendors" className="market-btn-secondary min-h-11 text-center sm:min-w-[180px]">
                Browse vendors
              </Link>
              <Link href="/become-a-vendor" className="market-btn-primary min-h-11 text-center sm:min-w-[180px]">
                Become a vendor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <VendorExpandCta ctaHref="/become-a-vendor" />
    </div>
  );
}
