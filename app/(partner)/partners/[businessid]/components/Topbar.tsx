"use client";

import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";
import { DEFAULT_PROFILE_AVATAR } from "@/app/(home)/Components/nav/navConfig";

const Topbar = ({
  setIsSidebarOpen,
  businessName,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  businessName?: string;
}) => {
  const displayName = businessName?.trim() || "Your business";

  return (
    <header className="dashboard-topbar">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="rounded-lg border border-dashboard-border-light bg-white p-2 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gold"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-dashboard-text" />
        </button>

        <div className="min-w-0">
          <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-dashboard-gold">
            Partner dashboard
          </p>
          <h2 className="truncate font-poppins text-base font-semibold text-dashboard-text sm:text-lg" title={displayName}>
            {displayName}
          </h2>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 justify-center px-6 lg:flex">
        <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-dashboard-border-light bg-white px-3 py-2 text-dashboard-muted">
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate font-montserrat text-xs">
            Manage listings, orders, and payout readiness from one workspace.
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative rounded-lg p-2 text-dashboard-muted hover:bg-surface-cream hover:text-dashboard-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gold/50"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-dashboard-muted" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <Image
          src={DEFAULT_PROFILE_AVATAR}
          width={40}
          height={40}
          alt="Profile"
          className="rounded-full border border-border-warm"
        />
      </div>
    </header>
  );
};

export default Topbar;
