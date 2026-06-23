import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Contact Mosaic Biz Hub",
  description: "Contact Mosaic Biz Hub for marketplace support, vendor questions, and general inquiries.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
