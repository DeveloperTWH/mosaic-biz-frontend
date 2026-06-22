"use client";

import React, { useEffect, useState } from "react";
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

  const [showUploadScreen, setShowUploadScreen] = useState(false);

  useEffect(() => {
    if (business && Object.keys(business).length > 0) {
      setShowUploadScreen(!business.logo);
    }
  }, [business]);

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
          className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden bg-brand-navy shadow transition-transform duration-300 md:static md:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex justify-end p-4 md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gold"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col items-center p-6">
            <div className="rounded-full border-2 border-white/80 p-1">
              {business?.logo ? (
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
                  <img
                    src={business.logo}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-dashboard-gold text-lg font-bold text-brand-navy">
                  {avatarInitial}
                </div>
              )}
            </div>
            <h2 className="mt-2 text-center text-lg font-semibold capitalize text-white">
              {displayName}
            </h2>
          </div>

          <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto py-4">
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
                  className={`flex min-h-11 w-full items-center gap-3 px-4 py-3 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gold ${
                    isActive
                      ? "bg-dashboard-gold/20 text-dashboard-gold"
                      : "hover:bg-white/10"
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pb-4">
            <button
              type="button"
              onClick={async () => await logoutUser()}
              className="flex min-h-11 w-full items-center gap-3 px-4 py-2 text-sm font-medium text-white hover:bg-red-600/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gold"
            >
              <LogOut className="h-5 w-5" /> Logout
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
