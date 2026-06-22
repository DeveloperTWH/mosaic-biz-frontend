import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { FormSurface } from "./form-field";

const inputVariants = cva(
  "flex w-full rounded-md font-poppins text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      surface: {
        auth: "min-h-11 h-11 border border-dashboard-input-border bg-white px-4 py-2 text-brand-navy placeholder:text-brand-muted focus:border-brand-gold focus:ring-brand-gold/40",
        dashboard:
          "min-h-11 h-11 border border-dashboard-input-border bg-white px-4 py-2 text-dashboard-text placeholder:text-dashboard-muted focus:border-dashboard-gold focus:ring-dashboard-gold/40",
        market: "market-input",
      } satisfies Record<FormSurface, string>,
    },
    defaultVariants: {
      surface: "auth",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, surface, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ surface }), className)}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input, inputVariants };
