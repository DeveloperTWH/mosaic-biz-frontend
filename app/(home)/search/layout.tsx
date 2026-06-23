import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Search the Marketplace",
  description: "Search Mosaic Biz Hub by product, service, location, or business type.",
  path: "/search",
});

export default function SearchLayout({ children }: { children: ReactNode }) {
  return children;
}
