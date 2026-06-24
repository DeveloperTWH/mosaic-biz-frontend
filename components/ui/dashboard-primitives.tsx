import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DashboardTone = "gold" | "navy" | "teal" | "orange" | "warning" | "neutral" | "success" | "danger";

const toneClasses: Record<DashboardTone, string> = {
  gold: "border-dashboard-gold/35 bg-dashboard-gold/10 text-dashboard-gold",
  navy: "border-brand-navy-light/20 bg-brand-navy-light/10 text-brand-navy-light",
  teal: "border-brand-teal/25 bg-brand-teal/10 text-brand-teal-dark",
  orange: "border-brand-orange/25 bg-brand-orange/10 text-brand-orange",
  warning: "border-dashboard-warn-border bg-dashboard-warn-bg text-dashboard-warn-text",
  neutral: "border-dashboard-border-light bg-surface-cream text-dashboard-muted",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  danger: "border-red-200 bg-red-50 text-red-700",
};

const iconToneClasses: Record<DashboardTone, string> = {
  gold: "bg-dashboard-gold text-brand-navy",
  navy: "bg-brand-navy-light text-white",
  teal: "bg-brand-teal text-white",
  orange: "bg-brand-orange text-white",
  warning: "bg-dashboard-warn-text text-white",
  neutral: "bg-dashboard-muted text-white",
  success: "bg-emerald-600 text-white",
  danger: "bg-red-600 text-white",
};

export interface DashboardPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div className={cn("dashboard-page-header", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="dashboard-page-eyebrow">{eyebrow}</p> : null}
        <h1 className="dashboard-page-title">{title}</h1>
        {description ? <p className="dashboard-page-description">{description}</p> : null}
      </div>
      {action ? <div className="dashboard-page-action">{action}</div> : null}
    </div>
  );
}

export interface DashboardStatCardProps {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  tone?: DashboardTone;
  className?: string;
}

export function DashboardStatCard({
  label,
  value,
  description,
  icon,
  tone = "gold",
  className,
}: DashboardStatCardProps) {
  return (
    <article className={cn("dashboard-stat-card", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="dashboard-stat-label">{label}</p>
          <p className="dashboard-stat-value">{value}</p>
        </div>
        {icon ? (
          <div className={cn("dashboard-stat-icon", iconToneClasses[tone])} aria-hidden>
            {icon}
          </div>
        ) : null}
      </div>
      {description ? <p className="dashboard-stat-description">{description}</p> : null}
    </article>
  );
}

export interface DashboardStatusPillProps {
  children: ReactNode;
  tone?: DashboardTone;
  className?: string;
}

export function DashboardStatusPill({
  children,
  tone = "neutral",
  className,
}: DashboardStatusPillProps) {
  return <span className={cn("dashboard-status-pill", toneClasses[tone], className)}>{children}</span>;
}

export interface DashboardActionLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
}

export function DashboardActionLink({
  href,
  children,
  variant = "primary",
  className,
}: DashboardActionLinkProps) {
  return (
    <Link href={href} className={cn("dashboard-action", `dashboard-action--${variant}`, className)}>
      {children}
    </Link>
  );
}

export interface DashboardIconButtonProps {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  tone?: "default" | "warning" | "danger";
  className?: string;
}

export function DashboardIconButton({
  label,
  children,
  onClick,
  href,
  tone = "default",
  className,
}: DashboardIconButtonProps) {
  const classes = cn("dashboard-icon-button", `dashboard-icon-button--${tone}`, className);
  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label} title={label}>
        {children}
        <span className="sr-only">{label}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={label} title={label}>
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export interface DashboardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DashboardPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DashboardPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  return (
    <nav className="dashboard-pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="dashboard-pagination-button"
      >
        Prev
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => changePage(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={cn(
            "dashboard-pagination-button",
            currentPage === page && "dashboard-pagination-button--active"
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="dashboard-pagination-button"
      >
        Next
      </button>
    </nav>
  );
}
