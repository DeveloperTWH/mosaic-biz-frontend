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
    <section className="bg-white">
      <div className="py-4 lg:py-6 max-w-7xl mx-auto px-6">
        {/* Heading - Compact */}
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-poppins">
            HOW IT WORKS
          </h2>

<p className="mt-2 text-gray-600 text-[12px] leading-5 max-w-6xl mx-auto font-mulish font-normal">
  Mosaic Biz Hub isn’t just a marketplace, it’s a movement. Our Mosaic creates a multicultural tapestry of unstoppable success, a marketplace of diverse business excellence.
  We connect conscious consumers with verified, minority-owned businesses through a platform built for visibility, trust, and growth. Mosaic Biz Hub is dedicated to empowering all minority-owned businesses at least 51% owned that are Hispanic or Latino, Asian, African American, Women, or disabled veterans, by providing a dynamic, inclusive, and accessible online/mobile marketplace that fosters economic growth, amplifies diverse voices, and connects entrepreneurs with eager consumers. Whether you're here to shop with purpose or scale your brand, here’s how to make the most of your experience
</p>

          <div className="flex justify-center mt-3">
            <div className="w-16 h-[2px] bg-gray-300" />
          </div>
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
          <div className="lg:col-span-7 bg-gray-50 p-3 flex items-center gap-2 min-h-[250px] md:min-h-[270px]">
            <div className="flex-shrink-0">
              <Image
                src={icons[tabClick]}
                alt="Step Icon"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

<div className="flex flex-col gap-1.5 text-[#5F5F5F] text-[13px] leading-5 font-montserrat font-[500] capitalize flex-1">
  <p>{tabContent[tabClick].description}</p>
</div>
          </div>
        </div>

        {/* Learn More Button */}
        <div className="flex justify-center mt-3">
          <Link 
            href="/how-to-use-this-app"
            className="px-6 py-2 bg-[#1e3a5f] text-white text-xs font-medium hover:bg-[#2a4a6f] transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

