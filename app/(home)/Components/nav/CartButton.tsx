"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

type CartButtonProps = {
  cartCount: number;
  mounted: boolean;
  bump: boolean;
  className?: string;
  showLabel?: boolean;
  onNavigate?: () => void;
};

export default function CartButton({
  cartCount,
  mounted,
  bump,
  className = "",
  showLabel = false,
  onNavigate,
}: CartButtonProps) {
  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      className={`market-nav-link relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-market-text transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-header ${mounted && bump ? "ring-2 ring-market-teal/40" : ""} ${className}`}
      aria-label={`Cart${mounted && cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? "s" : ""}` : ""}`}
      title="Cart"
    >
      <ShoppingCart size={22} className={`transition-transform ${mounted && bump ? "scale-110" : ""}`} />
      {showLabel && <span className="ml-3 font-medium">Cart</span>}
      {mounted && cartCount > 0 && (
        <span
          className={`${showLabel ? "ml-auto" : "absolute -right-1 -top-1"} h-5 min-w-[1.15rem] rounded-full bg-red-600 px-1.5 text-center text-[10px] font-bold leading-5 text-white shadow ring-2 ring-white transition-transform ${mounted && bump ? "scale-110" : ""}`}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
