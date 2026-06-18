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

/** Legal and compliance links — footer only (not header or hamburger). */
export const LEGAL_POLICY_LINKS: NavLink[] = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Dispute Resolution Process", href: "/dispute" },
  { label: "Refunds and Returns", href: "/refund-return" },
  { label: "Terms and Conditions – Consumer", href: "/consumer/terms" },
  { label: "Terms and Conditions – Vendor", href: "/vendor/terms" },
  { label: "Trust Badges – Consumer", href: "/consumer/trustbadge" },
  { label: "Trust Badges – Vendor", href: "/vendor/trustbadge" },
];

/** Footer legal column — same routes as LEGAL_POLICY_LINKS with footer-friendly labels. */
export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Refunds & returns", href: "/refund-return" },
  { label: "Dispute resolution", href: "/dispute" },
  { label: "Consumer terms", href: "/consumer/terms" },
  { label: "Vendor terms", href: "/vendor/terms" },
  { label: "Trust badges – consumer", href: "/consumer/trustbadge" },
  { label: "Trust badges – vendor", href: "/vendor/trustbadge" },
];

export const LOGIN_LINKS: NavLink[] = [
  { label: "Login as Customer", href: "/login?type=customer" },
  { label: "Login as Vendor", href: "/login?type=vendor" },
];

export const SEARCH_CTA: NavLink = {
  label: "Search marketplace",
  href: "/search",
};

/** Marketplace sub-links in hamburger (Products/Search handled by bottom nav). */
export const DRAWER_MARKETPLACE_LINKS: NavLink[] = SHOP_LINKS.filter(
  (link) => link.href !== "/products" && link.href !== "/search"
);

/** @deprecated Alias for DRAWER_MARKETPLACE_LINKS */
export const DRAWER_SHOP_LINKS: NavLink[] = DRAWER_MARKETPLACE_LINKS;

/** Hamburger explore/help links — no legal or policy pages. */
export const DRAWER_EXPLORE_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "How It Works", href: "/how-to-use-this-app" },
  { label: "FAQ", href: "/faq" },
  { label: "Refer a Vendor", href: "/refer-a-vendor" },
];

export type BottomNavItemId = "home" | "shop" | "discover" | "cart" | "account";

export type BottomNavItem = {
  id: BottomNavItemId;
  label: string;
  href: string;
};

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "shop", label: "Shop", href: "/products" },
  { id: "discover", label: "Discover", href: "/search" },
  { id: "cart", label: "Cart", href: "/cart" },
  { id: "account", label: "Account", href: "/login?type=customer" },
];

/** Routes where bottom nav should be hidden (checkout flow). */
export const COMMERCE_STICKY_ROUTE_PREFIXES = [
  "/product/",
  "/vendor-profile/service-vendor/",
  "/vendor-profile/food-vendor/",
] as const;

/**
 * Intentionally NOT hidden: `/vendor-profile/product-vendor/*`
 * Vendor product storefront is a browsing/listing page (links to `/product/[id]` for purchase).
 * No MobileStickyActionBar — bottom nav aids catalog navigation.
 */

/**
 * Commerce detail pages render MobileStickyActionBar instead of global bottom nav.
 * Hiding bottom nav avoids double-stacked fixed UI on mobile (Epic #95 / #101).
 */
export function isCommerceStickyRoute(pathname: string): boolean {
  return COMMERCE_STICKY_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export const BOTTOM_NAV_HIDDEN_PREFIXES = ["/checkout", ...COMMERCE_STICKY_ROUTE_PREFIXES];

export function getBottomNavActiveId(pathname: string): BottomNavItemId | null {
  if (pathname === "/") return "home";
  if (pathname === "/cart") return "cart";
  if (pathname.startsWith("/search")) return "discover";
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/customer") ||
    pathname === "/partners/dashboard"
  ) {
    return "account";
  }
  if (
    pathname.startsWith("/products") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/foods") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/service/") ||
    pathname.startsWith("/vendors") ||
    pathname.startsWith("/vendor-profile")
  ) {
    return "shop";
  }
  return null;
}

export function getAccountNavHref(
  isLoggedIn: boolean,
  isCustomer: boolean,
  storedRole?: string | null
): string {
  if (!isLoggedIn) return "/login?type=customer";
  if (storedRole === "business_owner") return "/partners/dashboard";
  if (storedRole === "customer") return "/customer/order";
  if (isCustomer) return "/customer/order";
  return "/partners/dashboard";
}

/** Sync role hint from localStorage (set on login/OTP). Client-only. */
export function getStoredUserRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_role");
}
