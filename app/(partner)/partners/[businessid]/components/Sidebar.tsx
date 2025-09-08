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
  Camera,
  Wallet
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
  const businessId = params.businessid as string; // ✅ Get businessId from URL
  const { business } = useBusinessStore(); // ✅ get business from store

  const [showUploadScreen, setShowUploadScreen] = useState(false);

  useEffect(() => {
    // Don't run until business is actually fetched
    if (business && Object.keys(business).length > 0) {
      if (!business.logo) {
        console.log("here", business.logo);
        setShowUploadScreen(true);
      } else {
        setShowUploadScreen(false); // hide if logo exists
      }
    }
  }, [business]);

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Inventory", icon: <Boxes className="w-5 h-5" /> },
    ...(business?.listingType !== "service"
      ? [{ label: "Orders", icon: <ShoppingCart className="w-5 h-5" /> }]
      : []),
    ...(business?.listingType === "service"
      ? [{ label: "Bookings", icon: <UserCircle className="w-5 h-5" /> }]
      : []),
    { label: "Transactions & Payouts", icon: <Wallet className="w-5 h-5" /> },
    { label: "My Account", icon: <UserCircle className="w-5 h-5" /> },
    { label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { label: "Support", icon: <LifeBuoy className="w-5 h-5" /> },
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

  return (
    <>
      {showUploadScreen ? (
        <BrandAssetsUpload
          setShowUploadScreen={setShowUploadScreen}
          business={business}
        />
      ) : (
        <aside
          className={`fixed top-0 left-0 z-40 flex flex-col w-64 h-screen bg-[#333333] shadow transform transition-transform duration-300 md:static md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } overflow-hidden`}
        >
          {/* ✅ Close Button (Mobile Only) */}
          <div className="flex justify-end p-4 md:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white rounded hover:bg-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center p-6">
            <div className="p-1 border-2 border-white rounded-full">
              {business?.logo ? (
                <div className="flex items-center justify-center w-12 h-12 overflow-hidden text-lg font-bold text-white rounded-full">
                  <img
                    src={business.logo}
                    alt={businessName || "Business"}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 overflow-hidden text-lg font-bold text-white bg-red-600 rounded-full">
                  businessName?.charAt(0).toUpperCase() || "B"
                </div>
              )}
            </div>
            <h2 className="mt-2 text-lg font-semibold text-white capitalize">
              {businessName}
            </h2>
          </div>

          <nav className="flex-1 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item, i) => {
              const link = getLink(item.label);
              const isActive =
                item.label === "Dashboard"
                  ? pathname === link // ✅ Dashboard only active on exact path
                  : pathname.startsWith(link); // ✅ Others active for subpaths too

              return (
                <Link
                  key={i}
                  href={link}
                  className={`flex items-center w-full gap-3 px-4 py-4 text-sm font-medium text-white transition-all duration-200 ease-in-out 
                  ${isActive ? "bg-custom-blue" : "hover:bg-custom-blue"}`}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </nav>

          <div>
            <button
              onClick={async () => await logoutUser()}
              className="flex items-center w-full gap-3 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </aside>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
