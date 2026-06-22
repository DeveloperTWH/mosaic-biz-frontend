import DashboardLoadingBlock from "@/components/ui/dashboard-loading-block";

const LoadingPage = () => {
  return (
    <DashboardLoadingBlock
      label="Loading business data…"
      minHeight="min-h-[60vh]"
    />
  );
};

export default LoadingPage;
