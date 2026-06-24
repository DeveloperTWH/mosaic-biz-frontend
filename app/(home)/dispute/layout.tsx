import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Dispute Resolution",
  description: "Learn how Mosaic Biz Hub handles shopper, vendor, and marketplace dispute resolution.",
  path: "/dispute",
});

export default function DisputeLayout({ children }: { children: ReactNode }) {
  return children;
}
