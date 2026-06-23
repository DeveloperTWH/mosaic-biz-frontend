import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Create an Account",
  description: "Create a Mosaic Biz Hub customer or vendor account.",
  path: "/signup",
  noIndex: true,
});

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children;
}
