type ShopperTrustCalloutProps = {
  children: string;
  className?: string;
};

/** Compact trust reassurance near commerce CTAs (product, cart, checkout). */
export default function ShopperTrustCallout({ children, className = "" }: ShopperTrustCalloutProps) {
  return (
    <p className={`commerce-trust-note ${className}`.trim()} role="note">
      {children}
    </p>
  );
}
