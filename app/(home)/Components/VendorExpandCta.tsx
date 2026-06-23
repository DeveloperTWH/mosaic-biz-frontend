import Link from "next/link";
import MarketTrustProofRow from "./MarketTrustProofRow";
import MarketTrustBadgeHint from "./MarketTrustBadgeHint";
import { VENDOR_TRUST_BENEFITS } from "./marketTrustProof";

export interface VendorExpandCtaProps {
  ctaHref?: string;
  ctaLabel?: string;
}

export default function VendorExpandCta({
  ctaHref = "/signup?type=vendor",
  ctaLabel = "Become a Vendor",
}: VendorExpandCtaProps) {
  return (
    <section
      className="relative w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
      aria-labelledby="vendor-expand-cta-heading"
    >
      <div className="w-full bg-market-header/75 px-4 py-16 sm:px-8 sm:py-20 md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
          <h2
            id="vendor-expand-cta-heading"
            className="market-section-heading-inverse text-2xl sm:text-3xl"
          >
            Expand your reach
          </h2>
          <p className="mt-2 font-poppins text-lg font-semibold uppercase tracking-wide text-market-text sm:text-xl">
            List your business on our platform
          </p>
          <div className="market-section-divider mt-4" aria-hidden />
          <p className="mx-auto mt-6 max-w-2xl font-montserrat text-sm leading-relaxed text-market-muted sm:text-base">
            Showcase products and services to customers who value verified minority-owned
            businesses — with trust badges that reflect your onboarding progress.
          </p>
          <MarketTrustProofRow items={VENDOR_TRUST_BENEFITS} compact className="mt-6" />
          <Link href={ctaHref} className="market-btn-primary mt-8 inline-block w-full min-w-[220px] sm:w-auto">
            {ctaLabel}
          </Link>
          <MarketTrustBadgeHint audience="vendor" className="mt-4 justify-center" />
        </div>
      </div>
    </section>
  );
}
