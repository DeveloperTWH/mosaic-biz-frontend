"use client";

import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export interface PartnerDashboardShellProps {
  children: ReactNode;
  businessName?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PartnerDashboardShell({
  children,
  businessName,
  isSidebarOpen,
  setIsSidebarOpen,
}: PartnerDashboardShellProps) {
  return (
    <div className="flex h-screen bg-surface-cream">
      <Sidebar
        businessName={businessName}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          setIsSidebarOpen={setIsSidebarOpen}
          businessName={businessName}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
