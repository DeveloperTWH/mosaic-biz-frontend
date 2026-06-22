import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { FormSurface } from "./form-field";

const textareaVariants = cva(
  "flex min-h-[5.5rem] w-full rounded-md px-4 py-3 font-poppins text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      surface: {
        auth: "border border-dashboard-input-border bg-white text-brand-navy placeholder:text-brand-muted focus:border-brand-gold focus:ring-brand-gold/40",
        dashboard:
          "border border-dashboard-input-border bg-white text-dashboard-text placeholder:text-dashboard-muted focus:border-dashboard-gold focus:ring-dashboard-gold/40",
        market: "market-input min-h-[5.5rem] h-auto py-3",
      } satisfies Record<FormSurface, string>,
    },
    defaultVariants: {
      surface: "auth",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, surface, ...props }, ref) => (
    <textarea
      className={cn(textareaVariants({ surface }), className)}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
