import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Review how Mosaic Biz Hub handles privacy, account data, and marketplace information.",
  path: "/privacy",
});

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
