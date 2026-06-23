import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type VendorFormSectionProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "dashboard" | "market";
};

/** Groups related onboarding fields to reduce cognitive load on long vendor forms. */
export default function VendorFormSection({
  title,
  description,
  icon,
  children,
  className,
  variant = "dashboard",
}: VendorFormSectionProps) {
  return (
    <section
      className={cn(
        variant === "market" ? "vendor-form-section vendor-form-section--market" : "vendor-form-section",
        className
      )}
    >
      <div className="vendor-form-section-header">
        {icon ? <span className="vendor-form-section-icon">{icon}</span> : null}
        <div>
          <h2 className="vendor-form-section-title">{title}</h2>
          {description ? <p className="vendor-form-section-desc">{description}</p> : null}
        </div>
      </div>
      <div className="vendor-form-section-body">{children}</div>
    </section>
  );
}
