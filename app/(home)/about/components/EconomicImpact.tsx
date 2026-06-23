import { MarketingSplitSection, MarketingBulletList } from "../../Components/marketing/MarketingSections";

export default function EconomicImpact() {
  return (
    <MarketingSplitSection
      title="Economic impact"
      imageSrc="/about/Economic.png"
      imageAlt="Economic impact of minority-owned businesses"
      tone="elevated"
    >
      <MarketingBulletList
        items={[
          {
            text: "Minority businesses contribute billions of dollars in revenue annually.",
          },
          {
            text: "They are significant drivers of employment and job creation, particularly in local communities.",
          },
          {
            text: "Supporting minority businesses strengthens the overall economic landscape and long-term competitiveness.",
          },
        ]}
      />
    </MarketingSplitSection>
  );
}
