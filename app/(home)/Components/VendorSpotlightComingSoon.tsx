import Link from "next/link";
import { Store } from "lucide-react";

export default function VendorSpotlightComingSoon() {
  return (
    <section className="bg-market-bg px-4 py-16 sm:px-6 lg:px-12">
      <div className="market-card mx-auto max-w-4xl p-8 text-center sm:p-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-market-glow/20 text-market-glow">
          <Store className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="market-section-heading">Featured Vendors</h2>
        <div className="market-section-divider" />
        <p className="mx-auto mt-4 max-w-xl font-montserrat text-sm text-market-muted sm:text-base">
          Verified vendor spotlights are coming soon. Browse the full directory today or apply to
          become a vendor on Mosaic Biz Hub.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/vendors" className="market-btn-secondary min-w-[200px]">
            Browse vendors
          </Link>
          <Link href="/become-a-vendor" className="market-btn-primary min-w-[200px]">
            Apply to become a vendor
          </Link>
        </div>
      </div>
    </section>
  );
}
