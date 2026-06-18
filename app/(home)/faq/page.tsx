import PublicContentLayout from "../Components/PublicContentLayout";
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
    >
      <FaqContent />
    </PublicContentLayout>
  );
}
