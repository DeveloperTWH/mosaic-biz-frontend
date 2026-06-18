"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type MobileFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Called when user taps Apply */
  onApply?: () => void;
  resultCount?: number;
};

/**
 * Bottom-sheet filter drawer for mobile listing pages (< lg).
 */
export default function MobileFilterDrawer({
  open,
  onClose,
  title = "Filters",
  children,
  onApply,
  resultCount,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl bg-market-surface shadow-xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="font-poppins text-lg font-semibold text-market-text">{title}</h2>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-market-muted hover:bg-white/5"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            className="market-btn-primary min-h-11 w-full text-sm normal-case"
            onClick={() => {
              onApply?.();
              onClose();
            }}
          >
            {resultCount !== undefined ? `Show ${resultCount} results` : "Apply filters"}
          </button>
        </div>
      </div>
    </div>
  );
}
