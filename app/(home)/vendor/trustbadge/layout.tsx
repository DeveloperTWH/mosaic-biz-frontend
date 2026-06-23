import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Vendor Trust Badge Guide",
  description: "Learn how Mosaic Biz Hub vendor trust badge review and verification language works.",
  path: "/vendor/trustbadge",
});

export default function VendorTrustBadgeLayout({ children }: { children: ReactNode }) {
  return children;
}
