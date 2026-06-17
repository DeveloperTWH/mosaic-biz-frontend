"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useState } from "react";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";

const tabContent = [
  {
    title: "Browse",
    description:
      "Explore a curated ecosystem of excellence. Navigate through vibrant categories—from beauty and wellness to business services and tech. Filter by identity, location, or industry to find vendors that reflect your values and meet your needs. Every listing is verified, so you can shop with confidence.",
  },
  {
    title: "Discover",
    description:
      "Find more than products—find purpose. Each vendor profile tells a story. Learn about their mission, culture, and community impact. Discover exclusive offers, seasonal promotions, and featured Power Brands that are shaping the future of e-commerce.",
  },
  {
    title: "Connect",
    description:
      "Build real relationships, not just transactions. Message vendors directly through our secure platform. Ask questions, request quotes, or follow your favorite brands to get notified about new drops, events, and deals. With in-app messaging and push alerts, staying connected is effortless.",
  },
  {
    title: "Support",
    description:
      "Empower businesses with every click. Every purchase fuels economic equity. Leave verified reviews, share your favorite vendors, and participate in loyalty programs that reward both you and the businesses you love. Vendors get access to tools like analytics, CRM, and AI chatbots to grow sustainably.",
  },
];

const icons = [
  "/howitworks/Browseicon2.png",
  "/howitworks/Discovericon2.png",
  "/howitworks/Connecticon2.png",
  "/howitworks/Supporticon2.png",
];

export default function HowItWorks() {
  const [tabClick, setTabClick] = useState(0);

  return (
    <section className="bg-market-bg py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:py-6">
        <div className="mb-8 text-center">
          <h2 className="market-section-heading">How Mosaic Biz Hub Works</h2>
          <div className="market-section-divider" />
          <p className="mx-auto mt-4 max-w-4xl font-mulish text-xs leading-5 text-market-muted sm:text-sm">
            Mosaic Biz Hub connects conscious consumers with verified minority-owned businesses
            through a platform built for visibility, trust, and growth.
          </p>
        </div>

        {/* Content - Compact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Left Tabs */}
          <div className="lg:col-span-5 grid gap-1">
            <Image
              src={tabClick === 0 ? "/howitworks/browseClick.png" : "/howitworks/browse.png"}
              alt="Browse"
              width={400}
              height={100}
              onClick={() => setTabClick(0)}
              className="cursor-pointer block w-full h-[70px] object-contain object-left"
            />

            <Image
              src={tabClick === 1 ? "/howitworks/discoverClick.png" : "/howitworks/discover.png"}
              alt="Discover"
              width={400}
              height={100}
              onClick={() => setTabClick(1)}
              className="cursor-pointer block w-full h-[70px] object-contain object-left"
            />

            <Image
              src={tabClick === 2 ? "/howitworks/connectClick.png" : "/howitworks/connect.png"}
              alt="Connect"
              width={400}
              height={100}
              onClick={() => setTabClick(2)}
              className="cursor-pointer block w-full h-[70px] object-contain object-left"
            />

            <Image
              src={tabClick === 3 ? "/howitworks/supportClick.png" : "/howitworks/support.png"}
              alt="Support"
              width={400}
              height={100}
              onClick={() => setTabClick(3)}
              className="cursor-pointer block w-full h-[70px] object-contain object-left"
            />
          </div>

          {/* Right Content */}
          <div className="market-card flex min-h-[250px] items-center gap-2 p-4 md:min-h-[270px] lg:col-span-7">
            <div className="flex-shrink-0">
              <Image
                src={icons[tabClick]}
                alt="Step Icon"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

<div className="flex flex-1 flex-col gap-1.5 font-montserrat text-[13px] font-medium capitalize leading-5 text-market-muted">
  <p>{tabContent[tabClick].description}</p>
</div>
          </div>
        </div>

        {/* Learn More Button */}
        <div className="flex justify-center mt-3">
          <Link 
            href="/how-to-use-this-app"
            className="market-btn-secondary px-6 py-2 text-xs normal-case"
          >
            Learn More
          </Link>
        </div>
      </div>

      <FeaturedVendors />
    </section>
  );
}

function FeaturedVendors() {
  const images = [
    "/Middle-banner.jpg",
    "/Middle-banner-2.jpg",
    "/Middle-banner-3.jpg",
    "/Middle-banner-4.jpg",
  ];

  return (
    <section className="w-full overflow-hidden bg-market-surface py-7">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={"auto"}
        spaceBetween={20}
        loop
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="w-full px-2 md:px-6"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="!w-[88%] md:!w-[78%] lg:!w-[72%]">
            <div className="w-full">
<Image
  src={src}
  alt={`Slide ${index + 1}`}
  width={1920}
  height={456}
  className="w-full h-auto object-contain"
  priority={index === 0}
/>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}



