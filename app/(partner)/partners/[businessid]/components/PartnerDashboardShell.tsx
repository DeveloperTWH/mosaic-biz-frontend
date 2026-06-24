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
    <div className="dashboard-app-shell flex h-screen overflow-hidden">
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
        <main className="dashboard-shell-main">{children}</main>
      </div>
    </div>
  );
}
