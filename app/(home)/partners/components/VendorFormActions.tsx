import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type VendorFormAction = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  variant?: "primary" | "secondary" | "ghost";
};

type VendorFormActionsProps = {
  primary?: VendorFormAction;
  secondary?: VendorFormAction;
  tertiary?: VendorFormAction;
  hint?: string;
  nextStepLabel?: string;
  className?: string;
  variant?: "dashboard" | "market";
  children?: ReactNode;
};

export default function VendorFormActions({
  primary,
  secondary,
  tertiary,
  hint,
  nextStepLabel,
  className,
  variant = "dashboard",
  children,
}: VendorFormActionsProps) {
  const renderAction = (action: VendorFormAction, role: "primary" | "secondary" | "ghost") => {
    const isLoading = action.loading;
    const label = isLoading ? (action.loadingLabel ?? action.label) : action.label;

    if (variant === "market") {
      const classNames =
        role === "primary"
          ? "market-btn-primary min-h-11 w-full normal-case sm:w-auto sm:min-w-[12rem]"
          : role === "secondary"
            ? "market-btn-secondary min-h-11 w-full normal-case sm:w-auto"
            : "min-h-11 w-full text-sm font-medium text-market-muted underline sm:w-auto";

      return (
        <button
          type={action.type ?? "button"}
          onClick={action.onClick}
          disabled={action.disabled || isLoading}
          className={cn(classNames, "inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50")}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {label}
        </button>
      );
    }

    if (role === "primary") {
      return (
        <Button
          type={action.type ?? "button"}
          onClick={action.onClick}
          disabled={action.disabled || isLoading}
          size="lg"
          className="min-h-11 w-full normal-case sm:w-auto sm:min-w-[12rem]"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
          {label}
        </Button>
      );
    }

    return (
      <Button
        type={action.type ?? "button"}
        onClick={action.onClick}
        disabled={action.disabled || isLoading}
        variant={role === "ghost" ? "ghost" : "outline"}
        size="lg"
        className="min-h-11 w-full normal-case sm:w-auto"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
        {label}
      </Button>
    );
  };

  return (
    <div className={cn("vendor-form-actions", className)}>
      {(hint || nextStepLabel) && (
        <div className="vendor-form-actions-meta">
          {hint ? <p className="vendor-form-actions-hint">{hint}</p> : null}
          {nextStepLabel ? (
            <p className="vendor-form-actions-next">
              <span className="font-medium">What happens next:</span> {nextStepLabel}
            </p>
          ) : null}
        </div>
      )}

      {children}

      <div className="vendor-form-actions-buttons">
        {tertiary ? renderAction(tertiary, "ghost") : null}
        {secondary ? renderAction(secondary, "secondary") : null}
        {primary ? renderAction(primary, "primary") : null}
      </div>
    </div>
  );
}
