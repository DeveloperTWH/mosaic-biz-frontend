import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Become a Vendor",
  description: "Apply to become a Mosaic Biz Hub vendor and prepare your business profile for marketplace review.",
  path: "/become-a-vendor",
});

export default function BecomeVendorLayout({ children }: { children: ReactNode }) {
  return children;
}
