import { BadgeCheck, Rocket, Users } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: BadgeCheck,
    title: "Verified Businesses",
    description: "Shop vendors reviewed for trust and quality.",
  },
  {
    icon: Rocket,
    title: "Fast Onboarding",
    description: "Verification review begins within 48 hours after you apply.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Every purchase supports minority-owned excellence.",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-market-surface py-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:gap-8 sm:px-6 lg:px-8">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="market-teal-soft flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-market-teal">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h3 className="font-poppins text-sm font-semibold uppercase tracking-wide text-market-text">
                {title}
              </h3>
              <p className="mt-1 font-montserrat text-xs text-market-muted sm:text-sm">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
