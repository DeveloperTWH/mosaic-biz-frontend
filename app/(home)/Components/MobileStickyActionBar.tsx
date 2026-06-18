"use client";

import type { ReactNode } from "react";

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

/**
 * Fixed bottom action bar for mobile conversion CTAs.
 * Adds safe-area padding and sits above page content (z-40).
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
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-market-header/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="Quick actions"
    >
      <div className="container-page flex items-center gap-3 p-3">
        {leading ? <div className="shrink-0">{leading}</div> : null}
        <div className="flex min-w-0 flex-1 gap-2">
          {secondaryLabel && onSecondaryClick ? (
            <button
              type="button"
              className="market-btn-secondary min-h-11 flex-1 text-sm normal-case"
              disabled={secondaryDisabled}
              onClick={onSecondaryClick}
            >
              {secondaryLabel}
            </button>
          ) : null}
          <button
            type="button"
            className="market-btn-primary min-h-11 flex-1 text-sm normal-case"
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

/** Apply to page root when a sticky bar is present */
export const MOBILE_STICKY_BAR_PADDING = "pb-24 lg:pb-0";
