import Link from "next/link";

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
      className="relative my-10 w-full bg-cover bg-center"
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
            Take your business to new heights by listing it on Mosaic Biz Hub. Connect
            with customers who value minority-owned brands, showcase your unique
            products and services, and grow your presence in the digital marketplace.
          </p>
          <Link href={ctaHref} className="market-btn-outline mt-8 inline-block min-w-[220px]">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
