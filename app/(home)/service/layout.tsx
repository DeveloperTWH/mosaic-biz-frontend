import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Service Details",
  description: "View service details from a Mosaic Biz Hub marketplace vendor.",
  path: "/service",
});

export default function ServiceDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
