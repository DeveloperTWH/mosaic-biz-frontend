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

/** Shop sub-links kept in hamburger drawer (Products/Search handled by bottom nav). */
export const DRAWER_SHOP_LINKS: NavLink[] = SHOP_LINKS.filter(
  (link) => link.href !== "/products" && link.href !== "/search"
);

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

export function getAccountNavHref(isLoggedIn: boolean, isCustomer: boolean): string {
  if (!isLoggedIn) return "/login?type=customer";
  if (isCustomer) return "/customer/order";
  return "/partners/dashboard";
}
