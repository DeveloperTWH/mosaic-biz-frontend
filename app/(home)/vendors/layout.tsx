import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Vendor Directory",
  description: "Browse verified vendors and discover minority-owned businesses on Mosaic Biz Hub.",
  path: "/vendors",
});

export default function VendorsLayout({ children }: { children: ReactNode }) {
  return children;
}
