import AccountLoadingBlock from "@/components/ui/account-loading-block";

export default function CustomerLoading() {
  return (
    <div className="min-h-[50vh] bg-brand-cream">
      <AccountLoadingBlock label="Loading your account…" minHeight="min-h-[50vh]" />
    </div>
  );
}
