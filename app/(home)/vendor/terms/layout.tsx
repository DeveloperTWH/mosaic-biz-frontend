import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Vendor Terms",
  description: "Review vendor terms for listing, selling, and operating on Mosaic Biz Hub.",
  path: "/vendor/terms",
});

export default function VendorTermsLayout({ children }: { children: ReactNode }) {
  return children;
}
