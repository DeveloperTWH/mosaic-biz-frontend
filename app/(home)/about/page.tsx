import PublicPageHero from "../Components/PublicPageHero";
import VendorExpandCta from "../Components/VendorExpandCta";
import AboutContent from "./components/AboutContent";
import CommunityDevelopment from "./components/CommunityDevelopment";
import EconomicImpact from "./components/EconomicImpact";
import InnovationDiversity from "./components/InnovationDiversity";
import Mission from "./components/Mission";
import HowItWorks from "./components/HowitWorks";

export default function AboutPage() {
  return (
    <main className="w-full bg-market-bg">
      <PublicPageHero
        title="About"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        imageUrl="/about.png"
      />
      <AboutContent />
      <EconomicImpact />
      <CommunityDevelopment />
      <HowItWorks />
      <InnovationDiversity />
      <Mission />
      <VendorExpandCta ctaHref="/become-a-vendor" />
    </main>
  );
}
