"use client";

import type { ReactNode } from "react";
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type VendorOnboardingStatusVariant =
  | "processing"
  | "pending"
  | "correction"
  | "success"
  | "error"
  | "info";

const variantStyles: Record<
  VendorOnboardingStatusVariant,
  { container: string; icon: string; title: string; text: string }
> = {
  processing: {
    container: "border-blue-200 bg-blue-50",
    icon: "text-blue-600",
    title: "text-blue-900",
    text: "text-blue-800",
  },
  pending: {
    container: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    title: "text-amber-900",
    text: "text-amber-800",
  },
  correction: {
    container: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    title: "text-amber-900",
    text: "text-amber-800",
  },
  success: {
    container: "border-green-200 bg-green-50",
    icon: "text-green-600",
    title: "text-green-900",
    text: "text-green-800",
  },
  error: {
    container: "border-red-200 bg-red-50",
    icon: "text-red-600",
    title: "text-red-900",
    text: "text-red-700",
  },
  info: {
    container: "border-blue-200 bg-blue-50",
    icon: "text-blue-600",
    title: "text-blue-900",
    text: "text-blue-800",
  },
};

export type VendorOnboardingStatusAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost";
};

export interface VendorOnboardingStatusPanelProps {
  variant: VendorOnboardingStatusVariant;
  title: string;
  description?: string;
  compact?: boolean;
  primaryAction?: VendorOnboardingStatusAction;
  secondaryAction?: VendorOnboardingStatusAction;
  children?: ReactNode;
  className?: string;
}

function StatusIcon({ variant }: { variant: VendorOnboardingStatusVariant }) {
  const iconClass = cn("h-5 w-5 flex-shrink-0", variantStyles[variant].icon);

  if (variant === "processing" || variant === "pending") {
    return <Loader2 className={cn(iconClass, "animate-spin")} aria-hidden />;
  }
  if (variant === "success") {
    return <CheckCircle className={iconClass} aria-hidden />;
  }
  if (variant === "info") {
    return <Clock className={iconClass} aria-hidden />;
  }
  return <AlertCircle className={iconClass} aria-hidden />;
}

export default function VendorOnboardingStatusPanel({
  variant,
  title,
  description,
  compact = false,
  primaryAction,
  secondaryAction,
  children,
  className,
}: VendorOnboardingStatusPanelProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        compact ? "space-y-2" : "space-y-3",
        styles.container,
        className
      )}
      role="status"
    >
      <div className="flex items-start gap-3">
        <StatusIcon variant={variant} />
        <div className="min-w-0 flex-1 space-y-1">
          <p className={cn("text-sm font-semibold", styles.title)}>{title}</p>
          {description ? (
            <p className={cn("text-sm leading-relaxed", styles.text)}>{description}</p>
          ) : null}
          {children}
        </div>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          {secondaryAction ? (
            <Button
              type="button"
              variant={secondaryAction.variant ?? "outline"}
              size="sm"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              className="normal-case"
            >
              {secondaryAction.label}
            </Button>
          ) : null}
          {primaryAction ? (
            <Button
              type="button"
              variant={primaryAction.variant ?? "default"}
              size="sm"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled || primaryAction.loading}
              className="normal-case"
            >
              {primaryAction.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  {primaryAction.label}
                </>
              ) : (
                primaryAction.label
              )}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
