import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Frequently Asked Questions",
  description: "Find answers about shopping, vendors, verification, payments, and support on Mosaic Biz Hub.",
  path: "/faq",
});

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children;
}
