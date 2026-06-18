import { FileText, Video, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import PublicPageHero from "../Components/PublicPageHero";
import VendorExpandCta from "../Components/VendorExpandCta";

const steps = [
  {
    number: 1,
    title: "Business Verification",
    body: (
      <>
        Complete your vendor application and pay the one-time{" "}
        <span className="font-semibold text-brand-navy">$24.99 verification fee</span> to activate trust badge review.
      </>
    ),
  },
  {
    number: 2,
    title: "Choose Your Tier",
    body: "Select Silver, Gold, or Platinum based on your goals. Compare features before subscribing.",
  },
  {
    number: 3,
    title: "Business Profile",
    body: "Add your logo, story, contact info, and minority-owned business details.",
  },
  {
    number: 4,
    title: "List Products & Services",
    body: "Create your first product, service, or food listing so customers can discover you.",
  },
  {
    number: 5,
    title: "Payout Setup",
    body: "Connect Stripe so you can receive payments securely when orders come in.",
  },
  {
    number: 6,
    title: "Final Review & Launch",
    body: "Submit for review and go live on the marketplace when approved.",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Vendor Resource Library",
    body: "Download templates, legal guides, pricing tools, and marketing checklists to help your business thrive.",
  },
  {
    icon: Video,
    title: "Video Onboarding",
    body: "Learn how to optimize your listings and use platform features effectively with our step-by-step video guides.",
  },
  {
    icon: HeadphonesIcon,
    title: "Live Support & Strategy Calls",
    body: "Platinum vendors receive quarterly coaching to refine their growth strategy. All tiers get access to our support team.",
  },
];

export default function BecomeAVendorPage() {
  return (
    <div className="flex flex-col">
      <PublicPageHero
        title="Become a Vendor"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Become a Vendor" },
        ]}
        imageUrl="/become-a-vendor/become-a-vendor.jpg"
        imageAlt="Become a vendor on Mosaic Biz Hub"
      />

      <div className="container-page py-12 sm:py-16">
        <section className="mb-16 text-center" aria-labelledby="vendor-steps-heading">
          <h2 id="vendor-steps-heading" className="market-section-heading">
            How to Become a Vendor
          </h2>
          <div className="market-section-divider" aria-hidden />
          <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm text-market-muted sm:text-base">
            Six clear steps from application to launch — built for minority-owned
            businesses ready to grow online.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="market-card-light text-left">
                <div className="market-step-badge mb-4">{step.number}</div>
                <h3 className="market-card-light-title mb-2">{step.title}</h3>
                <p className="market-card-light-body">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16 text-center" aria-labelledby="vendor-resources-heading">
          <h2 id="vendor-resources-heading" className="market-section-heading">
            Resources & Support
          </h2>
          <div className="market-section-divider" aria-hidden />
          <p className="mx-auto mt-4 max-w-2xl font-montserrat text-sm text-market-muted sm:text-base">
            Everything you need to set up, list, and grow — from day one.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <article key={resource.title} className="market-card-light text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-market-gold/15">
                    <Icon size={32} className="text-market-gold" aria-hidden />
                  </div>
                  <h3 className="market-card-light-title mb-3">{resource.title}</h3>
                  <p className="market-card-light-body">{resource.body}</p>
                </article>
              );
            })}
          </div>

          <div className="market-support-callout mx-auto mt-8 max-w-3xl">
            <p className="font-montserrat text-sm text-market-text sm:text-base">
              <span className="font-semibold text-market-gold">All vendors receive:</span>{" "}
              Access to our support team, community forums, and regular webinars to help
              you succeed.
            </p>
          </div>
        </section>

        <div className="text-center">
          <Link href="/signup?type=vendor" className="market-btn-primary inline-block min-w-[260px]">
            Become A Vendor Today
          </Link>
          <p className="mt-3 font-montserrat text-sm text-market-muted">
            One-time $24.99 verification fee applies
          </p>
        </div>
      </div>

      <VendorExpandCta ctaHref="/signup?type=vendor" ctaLabel="Start Vendor Application" />
    </div>
  );
}
