"use client";

import { useEffect, type ReactNode } from "react";

export type MobileStickyActionBarProps = {
  /** Optional leading content (price, summary) */
  leading?: ReactNode;
  /** Primary CTA label */
  primaryLabel: string;
  /** Primary CTA click handler */
  onPrimaryClick: () => void;
  /** Disable primary button */
  primaryDisabled?: boolean;
  /** Optional secondary CTA */
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  secondaryDisabled?: boolean;
};

/** Toggled on <html> while a commerce sticky bar is mounted — swaps body bottom padding for bar height. */
export const COMMERCE_STICKY_HTML_CLASS = "with-commerce-sticky";

/**
 * Fixed bottom commerce bar for product/service/food detail pages (mobile only).
 *
 * UX rule (Epic #101): On these routes the global bottom nav is hidden via
 * COMMERCE_STICKY_ROUTE_PREFIXES in navConfig.ts. This bar anchors to the
 * viewport bottom with iOS safe-area inset — it does not stack above bottom nav.
 */
export default function MobileStickyActionBar({
  leading,
  primaryLabel,
  onPrimaryClick,
  primaryDisabled = false,
  secondaryLabel,
  onSecondaryClick,
  secondaryDisabled = false,
}: MobileStickyActionBarProps) {
  useEffect(() => {
    document.documentElement.classList.add(COMMERCE_STICKY_HTML_CLASS);
    return () => {
      document.documentElement.classList.remove(COMMERCE_STICKY_HTML_CLASS);
    };
  }, []);

  return (
    <div
      className="market-commerce-sticky-bar fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-market-header/95 backdrop-blur lg:hidden"
      role="region"
      aria-label="Purchase actions"
    >
      <div className="container-page flex min-h-[4.25rem] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
        {leading ? <div className="max-w-[32%] shrink-0 truncate">{leading}</div> : null}
        <div className="flex min-w-0 flex-1 gap-2">
          {secondaryLabel && onSecondaryClick ? (
            <button
              type="button"
              className="market-btn-secondary min-h-11 min-w-0 flex-1 px-2 text-xs normal-case sm:px-4 sm:text-sm"
              disabled={secondaryDisabled}
              onClick={onSecondaryClick}
            >
              {secondaryLabel}
            </button>
          ) : null}
          <button
            type="button"
            className="market-btn-primary min-h-11 min-w-0 flex-1 px-2 text-xs normal-case sm:px-4 sm:text-sm"
            disabled={primaryDisabled}
            onClick={onPrimaryClick}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @deprecated Body padding is handled by `.with-commerce-sticky` on `<html>` when the bar mounts.
 * Kept as empty string so existing page wrappers do not need drive-by refactors.
 */
export const MOBILE_STICKY_BAR_PADDING = "";
