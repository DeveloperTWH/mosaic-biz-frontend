import { cn } from "@/lib/utils";

export type FormAlertVariant = "success" | "error" | "info";

const variantClasses: Record<FormAlertVariant, string> = {
  success: "form-alert form-alert--success",
  error: "form-alert form-alert--error",
  info: "form-alert form-alert--info",
};

export interface FormAlertProps {
  variant: FormAlertVariant;
  children: React.ReactNode;
  className?: string;
}

export function FormAlert({ variant, children, className }: FormAlertProps) {
  return (
    <div className={cn(variantClasses[variant], className)} role={variant === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
