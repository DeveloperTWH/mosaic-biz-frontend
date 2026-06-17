"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PILLS = [
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Foods", href: "/foods" },
  { label: "Search", href: "/search" },
];

export default function CategoryPills() {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex max-w-full flex-wrap justify-center gap-2 px-0 pb-2 pt-4 sm:gap-3 sm:pb-4">
      {PILLS.map(({ label, href }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-4 py-2 font-poppins text-xs font-semibold uppercase tracking-wide transition-colors ${
              active
                ? "bg-market-gold text-market-header"
                : "border border-white/10 bg-market-pill text-market-muted hover:border-market-gold/40 hover:text-market-text"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
