import { MarketingSplitSection } from "../../Components/marketing/MarketingSections";

export default function AboutContent() {
  return (
    <MarketingSplitSection
      title="About us"
      imageSrc="/about/aboutUsSection.png"
      imageAlt="Mosaic Biz Hub team"
      reverse
    >
      <p className="market-page-prose-muted">
        Mosaic Biz Hub was founded with a single vision: empower minority-owned businesses and help them succeed in the digital age. Every business has a story — and every story deserves to be heard.
      </p>
      <p className="market-page-prose-muted">
        Started by Bryan Harris, Mosaic Biz Hub bridges the gap for entrepreneurs who struggled to get noticed, had fewer opportunities, and faced obstacles that limited their potential.
      </p>
      <p className="market-page-prose-muted">
        Today, Mosaic Biz Hub is more than a platform — it is an ecosystem where businesses reach customers, express their culture, and grow with the support they deserve.
      </p>
      <p className="market-page-prose-muted">
        We do not merely list businesses. We highlight voices, traditions, and community impact — bringing restaurants, services, products, and more together under one digital roof that celebrates diversity.
      </p>
    </MarketingSplitSection>
  );
}
