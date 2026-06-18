"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, ShoppingCart, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCartCount } from "@/hooks/useCartCount";
import { getLoggedInCustomer } from "@/utils/authUtils";
import {
  BOTTOM_NAV_HIDDEN_PREFIXES,
  BOTTOM_NAV_ITEMS,
  getAccountNavHref,
  getBottomNavActiveId,
  type BottomNavItemId,
} from "./navConfig";
import { useHomeClick } from "./useHomeNavigation";

const ICONS: Record<BottomNavItemId, LucideIcon> = {
  home: Home,
  shop: ShoppingBag,
  discover: Search,
  cart: ShoppingCart,
  account: User,
};

function subscribeAuth(onStoreChange: () => void) {
  window.addEventListener("auth:login", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("auth:login", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getLoggedInSnapshot() {
  return localStorage.getItem("user_session") === "true";
}

function getLoggedInServerSnapshot() {
  return false;
}

function subscribeClient(onStoreChange: () => void) {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getClientServerSnapshot() {
  return false;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const onHomeClick = useHomeClick();
  const mounted = useSyncExternalStore(subscribeClient, getClientSnapshot, getClientServerSnapshot);
  const isLoggedIn = useSyncExternalStore(
    subscribeAuth,
    getLoggedInSnapshot,
    getLoggedInServerSnapshot
  );
  const [isCustomer, setIsCustomer] = useState<boolean | null>(null);

  const { count: cartCount } = useCartCount(isLoggedIn);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const user = await getLoggedInCustomer();
      if (!cancelled) {
        setIsCustomer(!!user);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const hidden = BOTTOM_NAV_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (hidden) return null;

  const activeId = getBottomNavActiveId(pathname);
  const accountHref =
    isCustomer === null && isLoggedIn
      ? BOTTOM_NAV_ITEMS.find((i) => i.id === "account")!.href
      : getAccountNavHref(isLoggedIn, !!isCustomer);

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Primary"
      className="market-bottom-nav fixed inset-x-0 bottom-0 z-[45] xl:hidden"
    >
      <ul className="flex items-stretch justify-around">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.id];
          const href = item.id === "account" ? accountHref : item.href;
          const isActive = activeId === item.id;
          const showCartBadge = item.id === "cart" && mounted && cartCount > 0;

          return (
            <li key={item.id} className="flex min-w-0 flex-1">
              <Link
                href={href}
                onClick={item.id === "home" ? onHomeClick : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`market-bottom-nav-link flex min-h-11 w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-market-gold/50 sm:text-xs ${
                  isActive ? "text-market-gold" : "text-market-muted hover:text-market-text"
                }`}
              >
                <span className="relative inline-flex">
                  <Icon size={22} strokeWidth={isActive ? 2.25 : 2} aria-hidden="true" />
                  {showCartBadge && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white ring-2 ring-market-header">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
