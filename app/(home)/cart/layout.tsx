import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Shopping Cart",
  description: "Review marketplace items in your Mosaic Biz Hub shopping cart.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
