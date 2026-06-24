import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Shop Products",
  description: "Browse products from verified minority-owned businesses on Mosaic Biz Hub.",
  path: "/products",
});

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
