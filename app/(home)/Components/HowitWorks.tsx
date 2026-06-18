"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useState } from "react";
import {
  ChevronRight,
  Compass,
  HeartHandshake,
  MessageCircle,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

type JourneyStep = {
  title: string;
  summary: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const journeySteps: JourneyStep[] = [
  {
    title: "Browse",
    summary: "Shop products, food, and services from verified vendors.",
    description:
      "Explore categories—from beauty and wellness to business services and tech. Filter by identity, location, or industry to find vendors that reflect your values.",
    href: "/products",
    icon: ShoppingBag,
  },
  {
    title: "Discover",
    summary: "Search by culture, category, or neighborhood.",
    description:
      "Find more than products—find purpose. Each vendor profile tells a story about mission, culture, and community impact.",
    href: "/search",
    icon: Compass,
  },
  {
    title: "Connect",
    summary: "Reach vendors and follow brands you love.",
    description:
      "Build real relationships, not just transactions. Message vendors, request quotes, and get notified about new drops and deals.",
    href: "/contact",
    icon: MessageCircle,
  },
  {
    title: "Support",
    summary: "Every purchase fuels minority-owned businesses.",
    description:
      "Leave verified reviews, share favorite vendors, and participate in programs that reward you and the businesses you love.",
    href: "/how-to-use-this-app",
    icon: HeartHandshake,
  },
];

const tabIcons = [
  "/howitworks/Browseicon2.png",
  "/howitworks/Discovericon2.png",
  "/howitworks/Connecticon2.png",
  "/howitworks/Supporticon2.png",
];

export default function HowItWorks() {
  const [tabClick, setTabClick] = useState(0);
  const activeStep = journeySteps[tabClick];

  return (
    <section className="bg-market-bg py-8 sm:py-12 lg:py-16">
      <div className="container-page">
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="market-section-heading">How Mosaic Biz Hub Works</h2>
          <div className="market-section-divider" />
          <p className="mx-auto mt-3 max-w-2xl font-montserrat text-sm leading-relaxed text-market-muted sm:mt-4 sm:text-base">
            Connect with verified minority-owned businesses through a platform built for visibility,
            trust, and growth.
          </p>
        </div>

        {/* Mobile: compact app-like action rows */}
        <div className="grid gap-3 lg:hidden" role="list">
          {journeySteps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.title}
                href={step.href}
                role="listitem"
                className="market-journey-action group"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-market-gold/15 text-market-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-poppins text-sm font-semibold text-market-text group-hover:text-market-gold">
                    {step.title}
                  </span>
                  <span className="mt-0.5 block font-montserrat text-xs leading-snug text-market-muted">
                    {step.summary}
                  </span>
                </span>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-market-muted group-hover:text-market-gold"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop: tabbed panel */}
        <div className="hidden grid-cols-1 items-stretch gap-3 lg:grid lg:grid-cols-12">
          <div className="grid gap-1 lg:col-span-5" role="tablist" aria-label="How it works steps">
            {journeySteps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                role="tab"
                aria-selected={tabClick === index}
                aria-controls={`how-it-works-panel-${index}`}
                onClick={() => setTabClick(index)}
                className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
              >
                <Image
                  src={
                    tabClick === index
                      ? `/howitworks/${step.title.toLowerCase()}Click.png`
                      : `/howitworks/${step.title.toLowerCase()}.png`
                  }
                  alt=""
                  width={400}
                  height={100}
                  className="block h-[70px] w-full cursor-pointer object-contain object-left"
                />
              </button>
            ))}
          </div>

          <div
            id={`how-it-works-panel-${tabClick}`}
            role="tabpanel"
            className="market-card flex min-h-[220px] items-center gap-4 p-4 lg:col-span-7 lg:min-h-[270px]"
          >
            <div className="shrink-0">
              <Image
                src={tabIcons[tabClick]}
                alt=""
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2 font-montserrat">
              <h3 className="font-poppins text-lg font-semibold uppercase tracking-wide text-market-text">
                {activeStep.title}
              </h3>
              <p className="text-sm leading-relaxed text-market-muted">{activeStep.description}</p>
              <Link
                href={activeStep.href}
                className="mt-1 inline-flex min-h-11 w-fit items-center gap-1 font-poppins text-xs font-semibold uppercase tracking-wide text-market-gold hover:text-market-gold-hover"
              >
                Get started
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center sm:mt-8">
          <Link href="/how-to-use-this-app" className="market-btn-secondary px-6 py-2.5 text-sm normal-case">
            Learn more
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
    <section className="mt-6 w-full overflow-hidden bg-market-surface py-5 sm:mt-8 sm:py-7">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView="auto"
        spaceBetween={16}
        loop
        centeredSlides
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="how-it-works-swiper w-full px-2 md:px-6"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="!w-[88%] md:!w-[78%] lg:!w-[72%]">
            <Image
              src={src}
              alt={`Featured vendor banner ${index + 1}`}
              width={1920}
              height={456}
              className="h-auto w-full rounded-xl object-contain"
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
