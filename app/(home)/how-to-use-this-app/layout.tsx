import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "How to Use Mosaic Biz Hub",
  description: "Learn how shoppers and vendors can browse, connect, list, and grow on Mosaic Biz Hub.",
  path: "/how-to-use-this-app",
});

export default function HowToUseLayout({ children }: { children: ReactNode }) {
  return children;
}
