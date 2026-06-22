import type { ReactNode } from "react";
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
    <div
      className="w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/contact/becomeVendor.png')" }}
    >
      <div className="bg-brand-navy/85 px-8 py-16 text-center text-white sm:py-24">
        <div className="container-page mx-auto max-w-[900px]">
          <h2 className="mb-2 font-poppins text-2xl font-bold text-white sm:text-3xl">{headline}</h2>
          <h3 className="mb-4 font-poppins text-xl font-bold text-white sm:text-2xl">{subheadline}</h3>
          <div className="mx-auto my-4 h-0.5 w-44 bg-white/80" aria-hidden />
          <p className="mx-auto mb-10 max-w-[700px] text-base leading-relaxed text-white/95 sm:text-lg">
            {body}
          </p>
          <Link
            href={href}
            className="inline-block min-h-11 rounded border-2 border-white px-10 py-3 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
