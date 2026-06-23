import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Book Services",
  description: "Find service providers and book with verified Mosaic Biz Hub vendors.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
