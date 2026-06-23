import * as React from "react";
import { cn } from "@/lib/utils";

export type FormSurface = "auth" | "dashboard" | "market";

const labelClasses: Record<FormSurface, string> = {
  auth: "mb-2 block font-poppins text-base font-medium text-brand-navy",
  dashboard: "mb-1.5 block font-poppins text-sm font-medium text-dashboard-text",
  market: "market-label",
};

const helperClasses: Record<FormSurface, string> = {
  auth: "mt-1.5 text-sm text-brand-muted",
  dashboard: "mt-1.5 text-sm text-dashboard-muted",
  market: "mt-1.5 text-sm text-market-muted",
};

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  error?: string;
  surface?: FormSurface;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  optional = false,
  helperText,
  error,
  surface = "auth",
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className={labelClasses[surface]}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
        {optional ? (
          <span className={cn("font-normal", surface === "market" ? "text-market-muted" : "text-brand-muted")}>
            {" "}
            (optional)
          </span>
        ) : null}
      </label>
      {children}
      {helperText ? <p className={helperClasses[surface]}>{helperText}</p> : null}
      {error ? <p className="mt-1.5 text-sm text-dashboard-warn-text">{error}</p> : null}
    </div>
  );
}
