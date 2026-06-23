import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Review Mosaic Biz Hub marketplace terms, responsibilities, and platform rules.",
  path: "/terms",
});

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
