import DashboardLoadingBlock from "@/components/ui/dashboard-loading-block";

export default function PartnerLoading() {
  return (
    <div className="min-h-screen bg-surface-cream">
      <DashboardLoadingBlock
        label="Loading partner dashboard…"
        minHeight="min-h-screen"
      />
    </div>
  );
}
