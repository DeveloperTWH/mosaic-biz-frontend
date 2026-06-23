import Image from "next/image";
import {
  MarketingFeatureCard,
  MarketingSectionHeader,
} from "../../Components/marketing/MarketingSections";

export default function CommunityDevelopment() {
  return (
    <section className="public-section bg-market-bg">
      <div className="container-page">
        <MarketingSectionHeader
          title="Community development"
          description="Minority-owned businesses strengthen neighborhoods, create jobs, and demonstrate meaningful social impact."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <MarketingFeatureCard
            icon={
              <Image src="/about/icon1.png" alt="" width={48} height={48} className="object-contain" />
            }
          >
            Minority businesses often operate in underserved communities and provide much-needed goods and services.
          </MarketingFeatureCard>

          <MarketingFeatureCard
            featured
            icon={
              <Image src="/about/shuttle 1.png" alt="" width={44} height={44} className="object-contain" />
            }
          >
            Supporting these businesses boosts the local economy and creates jobs in the area.
          </MarketingFeatureCard>

          <MarketingFeatureCard
            icon={
              <Image src="/about/sociology 1.png" alt="" width={48} height={48} className="object-contain" />
            }
          >
            Working with women and minority-owned businesses demonstrates a commitment to social impact and corporate responsibility.
          </MarketingFeatureCard>
        </div>
      </div>
    </section>
  );
}
