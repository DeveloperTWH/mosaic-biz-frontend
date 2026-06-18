import Link from "next/link";
import PublicPageHero from "../../Components/PublicPageHero";

const badgeLevels = [
  {
    badge: "Pending",
    status: "Hidden",
    meaning:
      "Businesses are still being reviewed and cannot list products or services yet.",
  },
  {
    badge: "Silver",
    status: "Verified",
    meaning:
      "The business has passed core verification checks and is a legitimate registered business.",
  },
  {
    badge: "Gold",
    status: "Fully Verified",
    meaning:
      "The business has provided additional proof and has a stronger online presence.",
  },
  {
    badge: "Platinum",
    status: "High Trust",
    meaning:
      "Businesses completed additional verification steps and consistently meet platform standards.",
  },
  {
    badge: "Diamond",
    status: "Top Tier",
    meaning:
      "Our highest level for businesses demonstrating excellence, reliability, and community impact.",
  },
];

export default function ConsumerTrustBadges() {
  return (
    <div className="flex flex-col">
      <PublicPageHero
        title="Trust Badges for Shoppers"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Trust Badges" },
        ]}
      />

      <div className="container-page max-w-4xl py-12 sm:py-16">
        <p className="mb-6 font-montserrat text-sm text-market-muted">
          Last updated: January 2026
        </p>

        <div className="market-support-callout mb-10 text-left">
          <p className="font-montserrat text-sm text-market-text sm:text-base">
            Badges indicate verified onboarding progress reviewed by Mosaic Biz Hub —{" "}
            <span className="font-semibold text-market-gold">not customer ratings or automated scores.</span>
          </p>
        </div>

        <section className="mb-10">
          <h2 className="market-section-heading text-2xl sm:text-3xl">
            Shop with confidence
          </h2>
          <div className="market-section-divider" />
          <p className="mt-4 max-w-2xl font-montserrat text-sm leading-relaxed text-market-muted sm:text-base">
            Every business on Mosaic Biz Hub goes through a real verification process before
            they can list products or services. Trust badges make that process visible so you
            know who you are buying from.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-6 font-poppins text-xl font-semibold text-market-text">
            Badge levels
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {badgeLevels.map((item) => (
              <article key={item.badge} className="market-card-light">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="market-card-light-title">{item.badge}</h3>
                  <span className="rounded-full bg-market-gold/15 px-3 py-1 font-montserrat text-xs font-semibold uppercase tracking-wide text-brand-navy">
                    {item.status}
                  </span>
                </div>
                <p className="market-card-light-body">{item.meaning}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-poppins text-xl font-semibold text-market-text">
            What we verify
          </h2>
          <ul className="grid grid-cols-1 gap-2 font-montserrat text-sm text-market-muted sm:grid-cols-2">
            {[
              "Legal business information",
              "EIN and/or business license",
              "Registration accuracy",
              "Website or social links",
              "Ownership information",
              "Contact details",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-market-gold" aria-hidden>
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/products" className="market-btn-primary min-w-[220px] text-center">
            Shop the marketplace
          </Link>
          <Link href="/vendors" className="market-btn-secondary min-w-[220px] text-center">
            Browse vendors
          </Link>
          <Link href="/vendor/trustbadge" className="market-btn-secondary min-w-[220px] text-center">
            Vendor badge guide
          </Link>
        </div>
      </div>
    </div>
  );
}
