"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "mosaic_announcement_dismissed";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(sessionStorage.getItem(STORAGE_KEY) !== "true");
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    document.documentElement.style.setProperty("--announcement-h", "0px");
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--announcement-h",
      visible ? "2.25rem" : "0px"
    );
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 z-[60] flex min-h-9 w-full items-center justify-center bg-market-header px-3 pr-10 text-center text-[11px] leading-snug text-market-text sm:px-4 sm:pr-12 sm:text-sm">
      <p className="font-poppins leading-snug">
        Shop minority-owned businesses and support the culture.{" "}
        <Link href="/products" className="market-nav-link font-semibold text-market-gold underline hover:text-market-gold-hover">
          Explore the marketplace
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="market-nav-link absolute right-2 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded text-lg text-white/80 hover:text-white"
        aria-label="Dismiss announcement"
      >
        ×
      </button>
    </div>
  );
}
