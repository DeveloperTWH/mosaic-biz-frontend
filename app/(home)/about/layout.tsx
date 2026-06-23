import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "About Mosaic Biz Hub",
  description: "Learn how Mosaic Biz Hub connects shoppers with trusted minority-owned businesses.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
