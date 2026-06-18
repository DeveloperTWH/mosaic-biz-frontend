import Link from "next/link";
import PublicPageHero from "../../Components/PublicPageHero";
import VendorExpandCta from "../../Components/VendorExpandCta";

const badgeLevels = [
  {
    badge: "Pending",
    tier: "In review",
    meaning: "We are still verifying your business. Your listing stays hidden.",
  },
  {
    badge: "Silver",
    tier: "Verified",
    meaning: "You meet our basic trust standards. Your listing is visible.",
  },
  {
    badge: "Gold",
    tier: "Fully verified",
    meaning: "You are fully verified and appear higher in search results.",
  },
  {
    badge: "Platinum",
    tier: "High trust",
    meaning: "You are a top performer with strong visibility.",
  },
  {
    badge: "Diamond",
    tier: "Top tier",
    meaning:
      "Elite, community-driven businesses with premium placement.",
  },
];

export default function VendorTrustBadges() {
  return (
    <div className="flex flex-col">
      <PublicPageHero
        title="Trust Badges for Vendors"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Vendor Trust Badges" },
        ]}
      />

      <div className="container-page max-w-4xl py-12 sm:py-16">
        <p className="mb-6 font-montserrat text-sm text-market-muted">
          Last updated: January 2026
        </p>

        <div className="market-support-callout mb-10 text-left">
          <p className="font-montserrat text-sm text-market-text sm:text-base">
            Trust badges reflect verified onboarding and profile completion reviewed by our team.
            They are <span className="font-semibold text-market-gold">not automated reputation scores</span> or customer ratings.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="market-section-heading text-2xl sm:text-3xl">
            Show customers you are verified
          </h2>
          <div className="market-section-divider" />
          <p className="mt-4 max-w-2xl font-montserrat text-sm leading-relaxed text-market-muted sm:text-base">
            When you join Mosaic Biz Hub, you earn a trust badge that shows shoppers how complete
            your business verification is. The more steps you complete, the higher your badge level.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-6 font-poppins text-xl font-semibold text-market-text">
            Badge levels
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {badgeLevels.map((item) => (
              <article key={item.badge} className="market-card-light">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="market-card-light-title">{item.badge}</h3>
                  <span className="rounded-full bg-market-gold/15 px-3 py-1 font-montserrat text-xs font-semibold uppercase tracking-wide text-brand-navy">
                    {item.tier}
                  </span>
                </div>
                <p className="market-card-light-body">{item.meaning}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-poppins text-xl font-semibold text-market-text">
            Verification steps
          </h2>
          <ul className="space-y-3 font-montserrat text-sm text-market-muted">
            <li className="market-card-light">
              <span className="market-card-light-title text-base">Legal & compliance</span>
              <p className="market-card-light-body mt-1">Business registration, licenses, and EIN documentation.</p>
            </li>
            <li className="market-card-light">
              <span className="market-card-light-title text-base">Profile completeness</span>
              <p className="market-card-light-body mt-1">Logo, story, products or services, images, and contact info.</p>
            </li>
            <li className="market-card-light">
              <span className="market-card-light-title text-base">Online presence</span>
              <p className="market-card-light-body mt-1">Website or social links that confirm your business identity.</p>
            </li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/become-a-vendor" className="market-btn-primary inline-block min-w-[240px]">
            Start vendor application
          </Link>
        </div>
      </div>

      <VendorExpandCta ctaHref="/signup?type=vendor" ctaLabel="Apply now" />
    </div>
  );
}
