import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Consumer Trust Badge Guide",
  description: "Learn how Mosaic Biz Hub trust badges help shoppers understand vendor verification signals.",
  path: "/consumer/trustbadge",
});

export default function ConsumerTrustBadgeLayout({ children }: { children: ReactNode }) {
  return children;
}
