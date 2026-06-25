import Link from "next/link";

type PolicyCtaProps = {
  headline: string;
  subheadline: string;
  body: string;
  href: string;
  linkLabel: string;
};

export function PolicyPageCta({ headline, subheadline, body, href, linkLabel }: PolicyCtaProps) {
  return (
    <section className="market-readable-band" aria-labelledby="policy-page-cta-heading">
      <div className="market-readable-band__glow" aria-hidden />
      <div className="market-readable-band__content">
        <div className="container-page mx-auto max-w-[900px]">
          <h2
            id="policy-page-cta-heading"
            className="mb-2 font-poppins text-2xl font-bold uppercase tracking-wide text-market-text sm:text-3xl"
          >
            {headline}
          </h2>
          <p className="mb-4 font-poppins text-xl font-bold uppercase tracking-wide text-market-text sm:text-2xl">
            {subheadline}
          </p>
          <div className="market-section-divider" aria-hidden />
          <p className="mx-auto mb-10 mt-6 max-w-[700px] font-montserrat text-base leading-relaxed text-market-muted sm:text-lg">
            {body}
          </p>
          <Link href={href} className="market-btn-primary inline-block min-h-11 sm:min-w-[220px]">
            {linkLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
