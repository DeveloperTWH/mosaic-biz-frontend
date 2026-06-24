import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Sign In",
  description: "Sign in to your Mosaic Biz Hub shopper, vendor, or admin account.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
