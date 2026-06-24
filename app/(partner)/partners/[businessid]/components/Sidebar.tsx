"use client";

import React, { useCallback, useState } from "react";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  UserCircle,
  Settings,
  LifeBuoy,
  LogOut,
  X,
  Wallet,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { logoutUser } from "@/utils/logoutUser";
import { useBusinessStore } from "@/app/store/businessStore";
import BrandAssetsUpload from "./Uploads";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  businessName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  businessName,
}) => {
  const pathname = usePathname();
  const params = useParams();
  const businessId = params.businessid as string;
  const { business } = useBusinessStore();

  const [dismissedUploadBusinessId, setDismissedUploadBusinessId] = useState<string | null>(null);
  const businessRecordId = business?._id ?? businessId;
  const showUploadScreen =
    Boolean(business && Object.keys(business).length > 0 && !business.logo) &&
    dismissedUploadBusinessId !== businessRecordId;
  const setShowUploadScreen = useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (value) => {
      const nextValue =
        typeof value === "function" ? value(showUploadScreen) : value;
      setDismissedUploadBusinessId(nextValue ? null : businessRecordId);
    },
    [businessRecordId, showUploadScreen],
  );

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Inventory", icon: <Boxes className="h-5 w-5" /> },
    ...(business?.listingType !== "service"
      ? [{ label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> }]
      : []),
    ...(business?.listingType === "service"
      ? [{ label: "Bookings", icon: <UserCircle className="h-5 w-5" /> }]
      : []),
    { label: "Transactions & Payouts", icon: <Wallet className="h-5 w-5" /> },
    { label: "My Account", icon: <UserCircle className="h-5 w-5" /> },
    { label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { label: "Support", icon: <LifeBuoy className="h-5 w-5" /> },
  ];

  const getLink = (label: string) => {
    if (label === "Dashboard") {
      return `/partners/${businessId}`;
    }
    if (label === "Transactions & Payouts") {
      return `/partners/${businessId}/finance`;
    }
    return `/partners/${businessId}/${label.toLowerCase().replace(" ", "-")}`;
  };

  const displayName = businessName || business?.businessName || "Business";
  const avatarInitial = displayName.charAt(0).toUpperCase() || "B";

  return (
    <>
      {showUploadScreen ? (
        <BrandAssetsUpload
          setShowUploadScreen={setShowUploadScreen}
          business={business}
        />
      ) : (
        <aside
          className={`dashboard-sidebar ${
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
          aria-label="Vendor dashboard navigation"
        >
          <div className="flex justify-end p-4 md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gold"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="dashboard-sidebar-brand">
            <div className="flex items-center gap-3">
              {business?.logo ? (
                <div className="dashboard-business-avatar">
                  <img
                    src={business.logo}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="dashboard-business-avatar">
                  {avatarInitial}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-dashboard-gold">
                  Vendor workspace
                </p>
                <h2 className="mt-1 truncate font-poppins text-sm font-semibold text-white" title={displayName}>
                  {displayName}
                </h2>
              </div>
            </div>
          </div>

          <nav className="dashboard-sidebar-nav">
            {navItems.map((item) => {
              const link = getLink(item.label);
              const isActive =
                item.label === "Dashboard"
                  ? pathname === link
                  : pathname.startsWith(link);

              return (
                <Link
                  key={item.label}
                  href={link}
                  onClick={() => setIsOpen(false)}
                  className={`dashboard-sidebar-link ${
                    isActive
                      ? "dashboard-sidebar-link--active"
                      : "dashboard-sidebar-link--inactive"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="min-w-0 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="dashboard-sidebar-footer">
            <Link
              href="/partners"
              onClick={() => setIsOpen(false)}
              className="dashboard-sidebar-link dashboard-sidebar-link--inactive mb-1"
            >
              <Store className="h-5 w-5" />
              <span>Partner hub</span>
            </Link>
            <button
              type="button"
              onClick={async () => await logoutUser()}
              className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 font-montserrat text-sm font-semibold text-white/80 transition-colors hover:bg-red-600/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gold"
            >
              <LogOut className="h-5 w-5" /> <span>Logout</span>
            </button>
          </div>
        </aside>
      )}

      {isOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      ) : null}
    </>
  );
};

export default Sidebar;
