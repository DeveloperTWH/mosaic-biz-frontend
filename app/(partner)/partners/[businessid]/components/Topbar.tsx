"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";
import Image from "next/image";
import { DEFAULT_PROFILE_AVATAR } from "@/app/(home)/Components/nav/navConfig";

const Topbar = ({
  setIsSidebarOpen,
  businessName,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  businessName?: string;
}) => {
  return (
    <header className="flex w-full items-center justify-between border-b border-border-warm bg-surface-panel px-4 py-4 shadow-sm md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          className="rounded-md bg-surface-cream p-2 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gold"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-dashboard-text" />
        </button>

        <div className="min-w-0">
          <p className="font-montserrat text-xs uppercase tracking-wide text-dashboard-muted">
            Partner dashboard
          </p>
          <h2 className="truncate font-poppins text-lg font-semibold text-dashboard-text">
            {businessName ? `Welcome, ${businessName}` : "Welcome"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="relative" aria-label="Notifications">
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
