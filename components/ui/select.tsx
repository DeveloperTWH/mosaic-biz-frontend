import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { FormSurface } from "./form-field";

const selectVariants = cva(
  "flex w-full rounded-md font-poppins text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      surface: {
        auth: "min-h-11 h-11 border border-dashboard-input-border bg-white px-4 text-brand-navy focus:border-brand-gold focus:ring-brand-gold/40",
        dashboard:
          "min-h-11 h-11 border border-dashboard-input-border bg-white px-4 text-dashboard-text focus:border-dashboard-gold focus:ring-dashboard-gold/40",
        market: "market-select",
      } satisfies Record<FormSurface, string>,
    },
    defaultVariants: {
      surface: "auth",
    },
  }
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, surface, children, ...props }, ref) => (
    <select className={cn(selectVariants({ surface }), className)} ref={ref} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";

export { Select, selectVariants };
