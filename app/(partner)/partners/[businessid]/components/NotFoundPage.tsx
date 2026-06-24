import React from "react";
import Link from "next/link";
import DashboardEmptyState from "@/components/ui/dashboard-empty-state";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <DashboardEmptyState
        title="Business not found"
        description="We couldn't find the business you're looking for. Check the URL or return to your partner hub."
        ctaLabel="Go to partner hub"
        ctaHref="/partners"
      />
    </div>
  );
};

export default NotFoundPage;
