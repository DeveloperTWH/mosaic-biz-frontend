import Link from "next/link";

export default function VendorCtaBand() {
  return (
    <section className="public-section relative overflow-hidden bg-market-cta-band text-center">
      <div className="pointer-events-none absolute inset-0 bg-market-glow-radial opacity-70" aria-hidden />
      <div className="container-page relative max-w-3xl">
        <h2 className="market-section-heading-inverse">Ready to grow your business?</h2>
        <p className="mx-auto mt-4 max-w-xl font-montserrat text-sm text-market-muted sm:text-base">
          Join Mosaic Biz Hub and reach customers who want to support minority-owned brands.
        </p>
        <Link
          href="/become-a-vendor"
          className="market-btn-primary mt-8 inline-block w-full sm:min-w-[240px] sm:w-auto"
        >
          Become a vendor
        </Link>
      </div>
    </section>
  );
}
