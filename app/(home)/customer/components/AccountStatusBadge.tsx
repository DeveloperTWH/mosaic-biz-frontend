import { cn } from "@/lib/utils";

type BadgeVariant =
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "neutral"
  | "purple"
  | "indigo"
  | "orange";

const variantClasses: Record<BadgeVariant, string> = {
  success: "account-status-badge--success",
  warning: "account-status-badge--warning",
  info: "account-status-badge--info",
  danger: "account-status-badge--danger",
  neutral: "account-status-badge--neutral",
  purple: "account-status-badge--purple",
  indigo: "account-status-badge--indigo",
  orange: "account-status-badge--orange",
};

export function getOrderStatusVariant(status?: string): BadgeVariant {
  switch (status) {
    case "delivered":
    case "refunded":
      return "success";
    case "created":
      return "info";
    case "ordered":
      return "warning";
    case "accepted":
      return "indigo";
    case "rejected":
      return "danger";
    case "shipped":
      return "orange";
    case "cancelled":
      return "neutral";
    case "returned":
      return "purple";
    default:
      return "neutral";
  }
}

export function getBookingStatusVariant(status?: string): BadgeVariant {
  switch (status) {
    case "approved":
      return "success";
    case "pending_vendor_action":
      return "warning";
    case "rejected":
    case "cancelled":
      return "danger";
    case "completed":
      return "info";
    default:
      return "neutral";
  }
}

export function formatBookingStatus(status?: string) {
  if (!status) return "Unknown";
  return status.replace(/_/g, " ");
}

interface AccountStatusBadgeProps {
  label: string;
  variant: BadgeVariant;
  className?: string;
}

export default function AccountStatusBadge({
  label,
  variant,
  className,
}: AccountStatusBadgeProps) {
  return (
    <span className={cn("account-status-badge", variantClasses[variant], className)}>
      {label}
    </span>
  );
}
