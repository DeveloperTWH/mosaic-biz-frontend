import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded font-poppins text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-brand-gold text-brand-navy hover:bg-brand-gold-light",
        secondary: "bg-brand-navy-light text-white hover:bg-brand-navy",
        outline:
          "border-2 border-brand-gold bg-transparent text-brand-gold hover:bg-brand-gold/10",
        ghost: "bg-transparent text-brand-navy hover:bg-brand-cream",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        "outline-white":
          "border-2 border-white/80 bg-transparent text-white hover:bg-white/10",
      },
      size: {
        default: "px-8 py-3",
        sm: "px-4 py-2 text-[11px]",
        lg: "min-w-[220px] px-10 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
