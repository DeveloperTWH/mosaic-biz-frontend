import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Vendor Profile",
  description: "View a Mosaic Biz Hub vendor profile, business details, and available listings.",
  path: "/vendor-profile",
});

export default function VendorProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
