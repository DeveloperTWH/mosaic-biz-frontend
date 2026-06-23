"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { logoutUser } from "@/utils/logoutUser";
import { DEFAULT_PROFILE_AVATAR, LOGIN_LINKS, SHOP_LINKS, getStoredUserRole } from "./navConfig";
import CartButton from "./CartButton";

type HeaderActionsProps = {
  variant: "desktop" | "compact";
  isLoggedIn: boolean | null;
  isCustomer: boolean | null;
  cartCount: number;
  mounted: boolean;
  bump: boolean;
};

export default function HeaderActions({
  variant,
  isLoggedIn,
  isCustomer,
  cartCount,
  mounted,
  bump,
}: HeaderActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const storedRole = getStoredUserRole();
  const showCustomerNav = isCustomer === true || storedRole === "customer";
  const showVendorNav = storedRole === "business_owner";

  const visibilityClass = variant === "desktop" ? "hidden xl:flex" : "flex xl:hidden";

  if (isLoggedIn === null) {
    return (
      <div className={`${visibilityClass} items-center gap-2`}>
        <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className={`${visibilityClass} items-center gap-3`}>
        <CartButton cartCount={cartCount} mounted={mounted} bump={bump} />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-expanded={showDropdown}
            aria-label="Account menu"
            className="market-nav-link flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-header"
          >
            <Image
              src={DEFAULT_PROFILE_AVATAR}
              width={40}
              height={40}
              alt=""
              className="rounded-full border border-market-gold/40 ring-1 ring-white/10"
            />
          </button>
          {showDropdown && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-white/10 bg-market-elevated shadow-market-card">
              {showCustomerNav ? (
                <>
                  <div className="border-b border-white/10 px-4 py-2">
                    <p className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.14em] text-market-muted">
                      Browse
                    </p>
                  </div>
                  {SHOP_LINKS.filter((link) => link.href !== "/vendors").map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="market-dropdown-link px-4 py-2.5"
                      onClick={() => setShowDropdown(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/10 px-4 py-2">
                    <p className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.14em] text-market-muted">
                      Account
                    </p>
                  </div>
                  <Link
                    href="/customer/order"
                    className="market-dropdown-link px-4 py-2.5"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/customer/bookings"
                    className="market-dropdown-link px-4 py-2.5"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Bookings
                  </Link>
                </>
              ) : showVendorNav ? (
                <Link
                  href="/partners/dashboard"
                  className="market-dropdown-link rounded-t-lg px-4 py-3"
                  onClick={() => setShowDropdown(false)}
                >
                  Dashboard
                </Link>
              ) : null}
              <button
                type="button"
                onClick={async () => await logoutUser()}
                className="w-full rounded-b-lg border-t border-white/10 px-4 py-3 text-left text-sm font-medium text-red-300 hover:bg-red-950/40"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${visibilityClass} items-center gap-3`}>
      {variant === "desktop" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenLogin(!openLogin)}
            onMouseEnter={() => setOpenLogin(true)}
            aria-expanded={openLogin}
            className="market-btn-primary flex items-center px-6 py-2.5 text-sm uppercase tracking-wide"
          >
            Login
            <ChevronDown
              className={`ml-1.5 h-3.5 w-3.5 transition-transform ${openLogin ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          {openLogin && (
            <div
              className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-white/10 bg-market-elevated shadow-market-card"
              onMouseLeave={() => setOpenLogin(false)}
            >
              {LOGIN_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="market-dropdown-link px-4 py-3">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      <CartButton cartCount={cartCount} mounted={mounted} bump={bump} />
    </div>
  );
}
