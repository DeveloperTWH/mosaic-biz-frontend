import { CheckCircle } from "lucide-react";
import { MarketingSplitSection } from "../../Components/marketing/MarketingSections";

export default function InnovationDiversity() {
  return (
    <MarketingSplitSection
      title="Innovation and diversity"
      imageSrc="/about/inovation.png"
      imageAlt="Innovation and diversity in business"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-market-teal" aria-hidden />
          <p className="market-page-prose-muted">
            Minority and women entrepreneurs bring unique perspectives and experiences to their businesses, leading to innovation and industry revitalization.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-market-teal" aria-hidden />
          <p className="market-page-prose-muted">
            Women and minority-owned businesses reflect the diversity of the U.S., contributing to a more inclusive and competitive marketplace.
          </p>
        </div>
      </div>
      <blockquote className="mt-6 border-l-2 border-market-gold/40 pl-4 font-montserrat text-sm italic leading-relaxed text-market-muted sm:text-base">
        &ldquo;The road to America&apos;s economic prosperity runs through our minority business communities. We must continue to ensure that minority-owned businesses and the entrepreneurs behind them have the tools, resources, and support they need to not just take part in but drive the economic success of this country.&rdquo;
        <footer className="mt-2 not-italic text-xs text-market-muted/80">— Deputy Commerce Secretary Don Graves</footer>
      </blockquote>
    </MarketingSplitSection>
  );
}
