"use client";

import Link from "next/link";
import PublicPageHero from "../Components/PublicPageHero";
import { buildAppUrl } from "@/lib/url/appUrl";

export default function ReferAVendorPage() {
  const shareUrl =
    typeof window !== "undefined"
      ? buildAppUrl("/become-a-vendor")
      : "https://mosaicbizhub.com/become-a-vendor";
  const mailto = `mailto:?subject=${encodeURIComponent("Join Mosaic Biz Hub as a vendor")}&body=${encodeURIComponent(
    `I thought your business would be a great fit for Mosaic Biz Hub — a marketplace for minority-owned businesses.\n\nApply here: ${shareUrl}`
  )}`;

  return (
    <div className="market-page min-h-screen">
      <PublicPageHero
        title="Refer a Vendor"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Refer a Vendor" },
        ]}
        imageUrl="/bgdetailpage.png"
      />
      <section className="container-page public-section max-w-3xl py-12">
        <h1 className="font-poppins text-3xl font-semibold text-market-text">Grow the marketplace together</h1>
        <p className="mt-4 font-montserrat text-market-muted">
          Know a minority-owned business that should join Mosaic Biz Hub? Share our vendor application — referral
          rewards will be available when the backend program launches.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="market-btn-primary min-h-11 px-6"
            onClick={() => {
              void navigator.clipboard?.writeText(shareUrl);
            }}
          >
            Copy invite link
          </button>
          <a href={mailto} className="market-btn-secondary inline-flex min-h-11 items-center justify-center px-6">
            Email invitation
          </a>
        </div>
        <p className="mt-6 rounded-lg border border-dashed border-white/15 bg-market-elevated p-4 text-sm text-market-muted">
          Backend-dependent: referral codes, tracking, and reward badges are not yet wired. This page provides share
          surfaces until the referral API is available.
        </p>
        <Link href="/become-a-vendor" className="mt-6 inline-block font-semibold text-market-gold hover:underline">
          View vendor benefits →
        </Link>
      </section>
    </div>
  );
}
