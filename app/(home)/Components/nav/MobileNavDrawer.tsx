"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart } from "lucide-react";
import { logoutUser } from "@/utils/logoutUser";
import {
  MOBILE_DRAWER_ID,
  HOME_LINK,
  SHOP_LINKS,
  BECOME_VENDOR_LINK,
  LEARN_LINKS,
  MORE_LINKS,
  SEARCH_CTA,
  LOGIN_LINKS,
} from "./navConfig";
import { useHomeClick } from "./useHomeNavigation";

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean | null;
  isCustomer: boolean | null;
  gender: string | null;
  cartCount: number;
  mounted: boolean;
};

function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="px-4 py-2">
      <div className="mb-2 flex min-h-11 items-center font-poppins text-sm font-medium uppercase tracking-wide text-market-muted">
        {title}
      </div>
      <div className="ml-2 space-y-1">{children}</div>
    </div>
  );
}

function DrawerLink({
  href,
  label,
  onClose,
  className = "",
}: {
  href: string;
  label: string;
  onClose: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`market-nav-link flex min-h-11 items-center py-2 pl-2 font-medium text-market-muted transition-colors hover:text-market-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 ${className}`}
    >
      {label}
    </Link>
  );
}

export default function MobileNavDrawer({
  open,
  onClose,
  isLoggedIn,
  isCustomer,
  gender,
  cartCount,
  mounted,
}: MobileNavDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onHomeClick = useHomeClick(onClose);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const topOffset = "calc(var(--header-h, 64px) + var(--announcement-h, 0px))";

  return (
    <div className="fixed inset-0 z-[55] xl:hidden" aria-hidden={!open}>
      <button
        type="button"
        className="absolute inset-x-0 bottom-0 bg-black/50"
        style={{ top: topOffset }}
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        id={MOBILE_DRAWER_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="absolute bottom-0 right-0 flex w-full max-w-sm flex-col border-l border-white/10 bg-market-surface shadow-xl transition-transform duration-300 ease-out"
        style={{
          top: topOffset,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="font-poppins text-lg font-semibold text-market-text">Menu</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="market-nav-link flex h-11 w-11 items-center justify-center rounded-lg text-market-muted hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto py-4">
          <div className="px-4 pb-2">
            <Link
              href={SEARCH_CTA.href}
              onClick={onClose}
              className="market-btn-primary flex min-h-11 w-full items-center justify-center gap-2 text-sm normal-case focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
            >
              {SEARCH_CTA.label}
            </Link>
          </div>

          <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
            <Link
              href={HOME_LINK.href}
              onClick={onHomeClick}
              className="market-nav-link flex min-h-11 items-center px-4 py-3 font-medium uppercase text-market-text hover:bg-white/5"
            >
              {HOME_LINK.label}
            </Link>

            <DrawerSection title="Shop">
              {SHOP_LINKS.map((link) => (
                <DrawerLink key={link.href} href={link.href} label={link.label} onClose={onClose} />
              ))}
            </DrawerSection>

            <div className="px-4 py-2">
              <Link
                href={BECOME_VENDOR_LINK.href}
                onClick={onClose}
                className="market-btn-primary flex min-h-11 w-full items-center justify-center text-sm normal-case focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
              >
                {BECOME_VENDOR_LINK.label}
              </Link>
            </div>

            <DrawerSection title="Learn">
              {LEARN_LINKS.map((link) => (
                <DrawerLink key={link.href} href={link.href} label={link.label} onClose={onClose} />
              ))}
            </DrawerSection>

            <DrawerSection title="More">
              {MORE_LINKS.map((link) => (
                <DrawerLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  onClose={onClose}
                  className="text-market-text/90"
                />
              ))}
            </DrawerSection>
          </nav>

          <div className="border-t border-white/10 px-4 pt-4">
            <div className="mb-2 font-poppins text-sm font-medium uppercase tracking-wide text-market-muted">
              Account
            </div>
            {isLoggedIn === null ? (
              <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            ) : isLoggedIn ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-3 py-3">
                  <Image
                    src={gender === "female" ? "/female-avatar.png" : "/male-avatar.png"}
                    width={44}
                    height={44}
                    alt=""
                    className="rounded-full border border-gray-300"
                  />
                  <span className="font-medium text-market-text">My Account</span>
                </div>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="market-nav-link flex min-h-11 items-center rounded px-4 py-3 font-medium text-market-text hover:bg-white/5"
                >
                  <ShoppingCart size={20} className="mr-3" aria-hidden="true" />
                  Cart
                  {mounted && cartCount > 0 && (
                    <span className="ml-auto rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                {isCustomer ? (
                  <>
                    <Link
                      href="/customer/order"
                      onClick={onClose}
                      className="market-nav-link block min-h-11 rounded px-4 py-3 font-medium text-market-text hover:bg-white/5"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/customer/bookings"
                      onClick={onClose}
                      className="market-nav-link block min-h-11 rounded px-4 py-3 font-medium text-market-text hover:bg-white/5"
                    >
                      My Bookings
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/partners/dashboard"
                    onClick={onClose}
                    className="market-nav-link block min-h-11 rounded px-4 py-3 font-medium text-market-text hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    await logoutUser();
                    onClose();
                  }}
                  className="market-nav-link min-h-11 w-full rounded px-4 py-3 text-left font-medium text-red-300 hover:bg-red-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href={LOGIN_LINKS[0].href}
                  onClick={onClose}
                  className="market-btn-primary flex min-h-11 w-full items-center justify-center px-4 py-3.5 text-sm uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
                >
                  Customer
                </Link>
                <Link
                  href={LOGIN_LINKS[1].href}
                  onClick={onClose}
                  className="market-btn-outline flex min-h-11 w-full items-center justify-center px-4 py-3.5 text-sm uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50"
                >
                  Vendor
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="market-nav-link flex min-h-11 items-center rounded px-4 py-3 font-medium text-market-text hover:bg-white/5"
                >
                  <ShoppingCart size={20} className="mr-3" aria-hidden="true" />
                  Cart
                  {mounted && cartCount > 0 && (
                    <span className="ml-auto rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
