import Link from "next/link";
import MarketTrustBadgeHint from "./MarketTrustBadgeHint";

export type DiscoveryAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "secondary";
};

export type DiscoveryFilterChip = {
  label: string;
  onClear?: () => void;
};

export interface MarketDiscoveryPanelProps {
  title: string;
  description?: string;
  actions?: DiscoveryAction[];
  suggestions?: Array<{ label: string; href: string }>;
  suggestionsLabel?: string;
  browseLinks?: Array<{ label: string; href: string }>;
  browseLabel?: string;
  collections?: Array<{ title: string; href: string }>;
  collectionsLabel?: string;
  activeFilters?: DiscoveryFilterChip[];
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
  className?: string;
  trustNote?: string;
  showTrustHint?: boolean;
}

function actionClassName(variant: DiscoveryAction["variant"] = "secondary") {
  if (variant === "primary") return "market-btn-primary px-5 py-2 text-sm normal-case";
  if (variant === "outline") return "market-btn-outline px-5 py-2 text-sm normal-case";
  return "market-btn-secondary px-5 py-2 text-sm normal-case";
}

export default function MarketDiscoveryPanel({
  title,
  description,
  actions = [],
  suggestions = [],
  suggestionsLabel = "Try searching for",
  browseLinks = [],
  browseLabel = "Browse categories",
  collections = [],
  collectionsLabel = "Explore by heritage",
  activeFilters = [],
  onRetry,
  retryLabel = "Try again",
  compact = false,
  className = "",
  trustNote,
  showTrustHint = false,
}: MarketDiscoveryPanelProps) {
  return (
    <div
      className={`market-discovery-panel market-content-safe-bottom ${compact ? "market-discovery-panel--compact" : ""} ${className}`}
    >
      <p className="market-discovery-panel-title">{title}</p>
      {description ? (
        <p className="market-discovery-panel-desc">{description}</p>
      ) : null}

      {trustNote ? <p className="market-trust-note mt-4">{trustNote}</p> : null}

      {activeFilters.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {activeFilters.map((filter) =>
            filter.onClear ? (
              <button
                key={filter.label}
                type="button"
                onClick={filter.onClear}
                className="market-active-filter-chip"
              >
                {filter.label}
                <span aria-hidden className="ml-1 opacity-70">
                  ×
                </span>
              </button>
            ) : (
              <span key={filter.label} className="market-active-filter-chip market-active-filter-chip--static">
                {filter.label}
              </span>
            )
          )}
        </div>
      ) : null}

      {(actions.length > 0 || onRetry) ? (
        <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {onRetry ? (
            <button type="button" onClick={onRetry} className="market-btn-outline px-5 py-2 text-sm normal-case">
              {retryLabel}
            </button>
          ) : null}
          {actions.map((action) =>
            action.href ? (
              <Link key={action.label} href={action.href} className={actionClassName(action.variant)}>
                {action.label}
              </Link>
            ) : (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={actionClassName(action.variant)}
              >
                {action.label}
              </button>
            )
          )}
        </div>
      ) : null}

      {suggestions.length > 0 ? (
        <div className={compact ? "mt-4" : "mt-6"}>
          <p className="market-discovery-section-label">{suggestionsLabel}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <Link key={item.href} href={item.href} className="market-suggestion-chip">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {browseLinks.length > 0 ? (
        <div className={compact ? "mt-4" : "mt-5"}>
          <p className="market-discovery-section-label">{browseLabel}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {browseLinks.map((item) => (
              <Link key={item.href} href={item.href} className="market-suggestion-chip">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {!compact && collections.length > 0 ? (
        <div className="mt-5">
          <p className="market-discovery-section-label">{collectionsLabel}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {collections.map((item) => (
              <Link key={item.href} href={item.href} className="market-suggestion-chip market-suggestion-chip--accent">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {showTrustHint ? (
        <MarketTrustBadgeHint className={`${compact ? "mt-4" : "mt-5"} justify-center text-center`} />
      ) : null}
    </div>
  );
}
