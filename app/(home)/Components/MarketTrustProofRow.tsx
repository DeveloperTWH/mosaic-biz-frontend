import type { TrustProofItem } from "./marketTrustProof";

type MarketTrustProofRowProps = {
  items: TrustProofItem[];
  compact?: boolean;
  className?: string;
};

export default function MarketTrustProofRow({
  items,
  compact = false,
  className = "",
}: MarketTrustProofRowProps) {
  return (
    <ul
      className={`market-trust-proof-row ${compact ? "market-trust-proof-row--compact" : ""} ${className}`.trim()}
      aria-label="Marketplace trust highlights"
    >
      {items.map(({ id, text, icon: Icon }) => (
        <li key={id} className="market-trust-proof-item">
          <Icon className="market-trust-proof-icon shrink-0" aria-hidden />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
