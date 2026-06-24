import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Product Details",
  description: "View product details from a Mosaic Biz Hub marketplace vendor.",
  path: "/product",
});

export default function ProductDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
