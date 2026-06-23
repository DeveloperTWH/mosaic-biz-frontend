import { MarketingSplitSection } from "../../Components/marketing/MarketingSections";

export default function Mission() {
  return (
    <MarketingSplitSection
      title="Our mission"
      imageSrc="/about/mission.png"
      imageAlt="Mosaic Biz Hub mission"
      reverse
    >
      <p className="market-page-prose">
        Mosaic Biz Hub maximizes opportunity for minority-owned and women-owned businesses through economic empowerment, mobile technology, and a geographic commerce tool that connects business owners with customers.
      </p>
      <p className="market-page-prose">
        We innovate how customers discover and connect with minority-owned and women-owned businesses — uplifting people, products, brands, and services to support growth, advancement, and unity.
      </p>
      <p className="market-page-prose-muted">
        By listing on Mosaic Biz Hub, entrepreneurs promote a more diverse and inclusive business environment, act as a catalyst for economic empowerment, and amplify minority-owned companies locally and globally.
      </p>
    </MarketingSplitSection>
  );
}
