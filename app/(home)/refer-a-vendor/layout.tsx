import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Refer a Vendor",
  description: "Refer a minority-owned business that should join the Mosaic Biz Hub marketplace.",
  path: "/refer-a-vendor",
});

export default function ReferVendorLayout({ children }: { children: ReactNode }) {
  return children;
}
