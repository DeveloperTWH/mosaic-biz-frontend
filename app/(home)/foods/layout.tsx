import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Food and Grocery",
  description: "Explore food, grocery, and restaurant vendors in the Mosaic Biz Hub marketplace.",
  path: "/foods",
});

export default function FoodsLayout({ children }: { children: ReactNode }) {
  return children;
}
