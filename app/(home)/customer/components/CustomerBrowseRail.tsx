"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACCOUNT_LINKS = [
  { label: "My Orders", href: "/customer/order" },
  { label: "My Bookings", href: "/customer/bookings" },
] as const;

const BROWSE_LINKS = [
  { label: "Shop Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Food & Grocery", href: "/foods" },
] as const;

export default function CustomerBrowseRail() {
  const pathname = usePathname();

  return (
    <nav
      className="customer-browse-rail"
      aria-label="Customer account and marketplace navigation"
    >
      <div className="customer-browse-rail__group">
        {ACCOUNT_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`customer-browse-rail__link ${isActive ? "customer-browse-rail__link--active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="customer-browse-rail__group customer-browse-rail__group--browse">
        <span className="customer-browse-rail__label">Browse</span>
        {BROWSE_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="customer-browse-rail__link">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
