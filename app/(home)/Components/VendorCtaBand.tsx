import Link from "next/link";
import MarketTrustProofRow from "./MarketTrustProofRow";
import MarketTrustBadgeHint from "./MarketTrustBadgeHint";
import { VENDOR_TRUST_BENEFITS } from "./marketTrustProof";

export default function VendorCtaBand() {
  return (
    <section className="public-section relative overflow-hidden bg-market-cta-band text-center">
      <div className="pointer-events-none absolute inset-0 bg-market-glow-radial opacity-70" aria-hidden />
      <div className="container-page relative max-w-3xl">
        <h2 className="market-section-heading-inverse">Ready to grow your business?</h2>
        <p className="mx-auto mt-4 max-w-xl font-montserrat text-sm text-market-muted sm:text-base">
          List on Mosaic Biz Hub and connect with shoppers who actively seek minority-owned brands.
        </p>
        <MarketTrustProofRow items={VENDOR_TRUST_BENEFITS} compact className="mt-6" />
        <Link
          href="/become-a-vendor"
          className="market-btn-primary mt-8 inline-block w-full sm:min-w-[240px] sm:w-auto"
        >
          Become a Vendor
        </Link>
        <MarketTrustBadgeHint audience="vendor" className="mt-4 justify-center" />
      </div>
    </section>
  );
}
