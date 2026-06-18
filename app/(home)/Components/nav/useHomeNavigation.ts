"use client";

import { usePathname } from "next/navigation";
import { useCallback, type MouseEvent } from "react";

export function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

/** Scroll to top when already on `/`; otherwise let Link navigate (Next.js scrolls to top). */
export function useHomeClick(onAfter?: () => void) {
  const pathname = usePathname();

  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onAfter?.();

      if (pathname === "/") {
        e.preventDefault();
        scrollToPageTop();
      }
    },
    [pathname, onAfter]
  );
}
