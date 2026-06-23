"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MarketingSectionHeader } from "../../Components/marketing/MarketingSections";
import MarketTrustProofRow from "../../Components/MarketTrustProofRow";
import { SHOPPER_TRUST_PROOFS } from "../../Components/marketTrustProof";

const tabContent = [
  {
    title: "Browse",
    description:
      "Explore a curated ecosystem of excellence. Navigate vibrant categories — from beauty and wellness to business services and tech. Filter by identity, location, or industry to find vendors that reflect your values. Every listing is verified, so you can shop with confidence.",
    icon: "/howitworks/Browseicon2.png",
  },
  {
    title: "Discover",
    description:
      "Find more than products — find purpose. Each vendor profile tells a story about mission, culture, and community impact. Discover exclusive offers, seasonal promotions, and featured brands shaping the future of e-commerce.",
    icon: "/howitworks/Discovericon2.png",
  },
  {
    title: "Connect",
    description:
      "Build real relationships, not just transactions. Message vendors through our secure platform, request quotes, and follow favorite brands for new drops, events, and deals.",
    icon: "/howitworks/Connecticon2.png",
  },
  {
    title: "Support",
    description:
      "Empower businesses with every click. Leave verified reviews, share favorite vendors, and participate in programs that reward both shoppers and the businesses they love.",
    icon: "/howitworks/Supporticon2.png",
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);
  const active = tabContent[activeTab];

  return (
    <section className="public-section bg-market-surface">
      <div className="container-page">
        <MarketingSectionHeader
          title="How it works"
          description="Mosaic Biz Hub connects conscious consumers with verified minority-owned businesses through a platform built for visibility, trust, and growth."
        />

        <MarketTrustProofRow items={SHOPPER_TRUST_PROOFS} className="mb-8" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="grid gap-2 lg:col-span-5">
            {tabContent.map((tab, index) => (
              <button
                key={tab.title}
                type="button"
                onClick={() => setActiveTab(index)}
                className={cn(
                  "marketing-how-tab",
                  activeTab === index && "marketing-how-tab--active"
                )}
                aria-pressed={activeTab === index}
              >
                <span className="text-market-gold">{String(index + 1).padStart(2, "0")}</span>
                {tab.title}
              </button>
            ))}
          </div>

          <div className="marketing-how-panel lg:col-span-7">
            <div className="flex-shrink-0">
              <Image
                src={active.icon}
                alt=""
                width={72}
                height={72}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-poppins text-lg font-semibold text-market-text">{active.title}</h3>
              <p className="mt-3 font-montserrat text-sm leading-relaxed text-market-muted sm:text-base">
                {active.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/how-to-use-this-app" className="market-btn-primary min-w-[200px] text-center">
            See full guide
          </Link>
        </div>
      </div>
    </section>
  );
}
