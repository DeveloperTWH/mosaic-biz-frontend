import PublicContentLayout from "../Components/PublicContentLayout";
import VendorExpandCta from "../Components/VendorExpandCta";
import FaqContent from "./FaqContent";

export default function FaqPage() {
  return (
    <PublicContentLayout
      title="FAQ"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "FAQ" },
      ]}
      imageUrl="/about.png"
      proseVariant="legal"
      footer={<VendorExpandCta />}
    >
      <FaqContent />
    </PublicContentLayout>
  );
}
