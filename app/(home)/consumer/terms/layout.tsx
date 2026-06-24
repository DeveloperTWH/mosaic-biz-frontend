import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Consumer Terms",
  description: "Review consumer terms for shopping and marketplace activity on Mosaic Biz Hub.",
  path: "/consumer/terms",
});

export default function ConsumerTermsLayout({ children }: { children: ReactNode }) {
  return children;
}
