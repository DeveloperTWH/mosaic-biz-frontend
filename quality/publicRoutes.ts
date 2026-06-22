export type PublicRoute = {
  id: string;
  path: string;
  label: string;
  policy?: boolean;
};

/**
 * Non-destructive public routes for quality scans.
 * Excludes auth, checkout, payment, cart mutation, and admin surfaces.
 */
export const PUBLIC_QUALITY_ROUTES: PublicRoute[] = [
  { id: "home", path: "/", label: "Homepage" },
  { id: "products", path: "/products", label: "Products" },
  { id: "services", path: "/services", label: "Services" },
  { id: "foods", path: "/foods", label: "Food" },
  { id: "vendors", path: "/vendors", label: "Vendors" },
  { id: "search", path: "/search", label: "Search" },
  { id: "about", path: "/about", label: "About" },
  { id: "contact", path: "/contact", label: "Contact" },
  { id: "faq", path: "/faq", label: "FAQ" },
  { id: "privacy", path: "/privacy", label: "Privacy", policy: true },
  { id: "terms", path: "/terms", label: "Terms", policy: true },
  { id: "refund-return", path: "/refund-return", label: "Refund & Return", policy: true },
  { id: "dispute", path: "/dispute", label: "Dispute Resolution", policy: true },
  { id: "consumer-terms", path: "/consumer/terms", label: "Consumer Terms", policy: true },
  { id: "vendor-terms", path: "/vendor/terms", label: "Vendor Terms", policy: true },
  { id: "consumer-trustbadge", path: "/consumer/trustbadge", label: "Consumer Trust Badge" },
  { id: "vendor-trustbadge", path: "/vendor/trustbadge", label: "Vendor Trust Badge" },
  { id: "how-to-use", path: "/how-to-use-this-app", label: "How to Use This App" },
];

export const QUALITY_SCAN_PORT = Number(process.env.QUALITY_SCAN_PORT ?? 3098);

export const QUALITY_SCAN_BASE_URL =
  process.env.QUALITY_SCAN_BASE_URL ?? `http://127.0.0.1:${QUALITY_SCAN_PORT}`;

export function routeUrls(baseUrl: string = QUALITY_SCAN_BASE_URL): string[] {
  return PUBLIC_QUALITY_ROUTES.map((route) => `${baseUrl.replace(/\/$/, "")}${route.path}`);
}
