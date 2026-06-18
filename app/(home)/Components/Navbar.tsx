"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartCount } from "@/hooks/useCartCount";
import { getLoggedInCustomer } from "@/utils/authUtils";
import CartSyncPrompt from "./CartSyncPrompt";
import BrandLogo from "./BrandLogo";
import DesktopNav from "./nav/DesktopNav";
import HeaderActions from "./nav/HeaderActions";
import MobileNavDrawer from "./nav/MobileNavDrawer";
import { MOBILE_DRAWER_ID } from "./nav/navConfig";
import { useHomeClick } from "./nav/useHomeNavigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isCustomer, setIsCustomer] = useState<boolean | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [bump, setBump] = useState(false);
  const prevCountRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const { count: cartCount } = useCartCount(isLoggedIn);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(session === "true");
    setGender(localStorage.getItem("user_gender"));

    (async () => {
      const user = await getLoggedInCustomer();
      setIsCustomer(!!user);
    })();

    setMounted(true);
  }, []);

  useEffect(() => {
    if (prevCountRef.current === null) {
      prevCountRef.current = cartCount;
      return;
    }

    const change = cartCount - prevCountRef.current;
    if (change !== 0) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 300);
      prevCountRef.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    const header = document.getElementById("site-header");
    const setH = () => {
      const h = header?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setH();
    const ro = new ResizeObserver(setH);
    if (header) ro.observe(header);
    window.addEventListener("resize", setH);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setH);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const onLogoClick = useHomeClick();

  return (
    <header
      id="site-header"
      className="market-glass-header fixed left-0 top-[var(--announcement-h,0px)] z-50 w-full px-4 py-4 font-poppins sm:px-6 lg:px-10 xl:px-20"
    >
      <CartSyncPrompt />

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 shrink items-center">
          <Link
            href="/"
            onClick={onLogoClick}
            className="inline-flex shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-header"
          >
            <BrandLogo variant="header" priority />
          </Link>
        </div>

        <DesktopNav />

        <HeaderActions
          variant="desktop"
          isLoggedIn={isLoggedIn}
          isCustomer={isCustomer}
          gender={gender}
          cartCount={cartCount}
          mounted={mounted}
          bump={bump}
        />

        <div className="flex items-center gap-1 xl:hidden">
          <HeaderActions
            variant="compact"
            isLoggedIn={isLoggedIn}
            isCustomer={isCustomer}
            gender={gender}
            cartCount={cartCount}
            mounted={mounted}
            bump={bump}
          />
          <button
            type="button"
            className="market-nav-link flex min-h-11 min-w-11 items-center justify-center rounded text-market-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-market-header"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls={MOBILE_DRAWER_ID}
          >
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <MobileNavDrawer
        open={isOpen}
        onClose={closeMenu}
        isLoggedIn={isLoggedIn}
        isCustomer={isCustomer}
        gender={gender}
        cartCount={cartCount}
        mounted={mounted}
      />
    </header>
  );
};

export default Navbar;
