import { formatMarketPrice } from "@/lib/marketplace/display";

export interface MarketPriceProps {
  value: unknown;
  compareAt?: unknown;
  onSale?: boolean;
  unavailableLabel?: string;
  allowZero?: boolean;
  className?: string;
  priceClassName?: string;
  compareClassName?: string;
  labelClassName?: string;
  label?: string;
}

export default function MarketPrice({
  value,
  compareAt,
  onSale = false,
  unavailableLabel = "Price on request",
  allowZero = false,
  className = "",
  priceClassName = "market-card-price",
  compareClassName = "market-card-price-compare",
  labelClassName = "market-card-price-label",
  label = "Price",
}: MarketPriceProps) {
  const displayPrice = formatMarketPrice(value, { allowZero });
  const displayCompare = onSale ? formatMarketPrice(compareAt, { allowZero }) : null;

  return (
    <div className={`market-card-price-block ${className}`}>
      <span className={labelClassName}>{displayPrice ? label : "Price"}</span>
      {displayPrice ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className={priceClassName}>{displayPrice}</span>
          {displayCompare ? <span className={compareClassName}>{displayCompare}</span> : null}
        </div>
      ) : (
        <span className="market-card-price-muted">{unavailableLabel}</span>
      )}
    </div>
  );
}
