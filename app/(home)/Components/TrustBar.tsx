import Link from "next/link";
import { BadgeCheck, Rocket, Users } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: BadgeCheck,
    title: "Verified Onboarding",
    description: "Businesses are reviewed before they can list products or services.",
    href: "/consumer/trustbadge",
  },
  {
    icon: Rocket,
    title: "48-Hour Review Start",
    description: "Vendor verification review begins within 48 hours after you apply.",
    href: "/become-a-vendor",
  },
  {
    icon: Users,
    title: "Purpose-Driven Commerce",
    description: "Every purchase supports verified minority-owned businesses.",
    href: "/about",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-market-surface py-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:gap-8 sm:px-6 lg:px-8">
        {TRUST_ITEMS.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={title}
            href={href}
            className="market-nav-link group flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-white/5"
          >
            <div className="market-teal-soft flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-market-teal">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h3 className="font-poppins text-sm font-semibold uppercase tracking-wide text-market-text group-hover:text-market-gold">
                {title}
              </h3>
              <p className="mt-1 font-montserrat text-xs text-market-muted sm:text-sm">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
