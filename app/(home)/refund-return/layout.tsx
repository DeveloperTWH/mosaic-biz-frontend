import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Refund and Return Policy",
  description: "Review refund and return guidance for Mosaic Biz Hub marketplace purchases.",
  path: "/refund-return",
});

export default function RefundReturnLayout({ children }: { children: ReactNode }) {
  return children;
}
