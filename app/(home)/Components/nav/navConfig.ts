export type NavLink = {
  label: string;
  href: string;
};

export const MOBILE_DRAWER_ID = "mobile-nav-drawer";

export const HOME_LINK: NavLink = { label: "HOME", href: "/" };

export const SHOP_LINKS: NavLink[] = [
  { label: "Products", href: "/products" },
  { label: "Foods", href: "/foods" },
  { label: "Services", href: "/services" },
  { label: "Vendors", href: "/vendors" },
  { label: "Search", href: "/search" },
];

export const BECOME_VENDOR_LINK: NavLink = {
  label: "Become a Vendor",
  href: "/become-a-vendor",
};

export const LEARN_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "How to Use This App", href: "/how-to-use-this-app" },
  { label: "FAQ", href: "/faq" },
];

export const MORE_LINKS: NavLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Dispute Resolution Process", href: "/dispute" },
  { label: "Refunds and Returns", href: "/refund-return" },
  { label: "Terms and Conditions – Consumer", href: "/consumer/terms" },
  { label: "Terms and Conditions – Vendor", href: "/vendor/terms" },
  { label: "Trust Badges – Consumer", href: "/consumer/trustbadge" },
  { label: "Trust Badges – Vendor", href: "/vendor/trustbadge" },
];

/** MORE dropdown excludes FAQ (shown under Learn in drawer). */
export const MORE_DROPDOWN_LINKS: NavLink[] = MORE_LINKS.filter(
  (link) => link.href !== "/faq"
);

export const LOGIN_LINKS: NavLink[] = [
  { label: "Login as Customer", href: "/login?type=customer" },
  { label: "Login as Vendor", href: "/login?type=vendor" },
];

export const SEARCH_CTA: NavLink = {
  label: "Search marketplace",
  href: "/search",
};
