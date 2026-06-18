import PublicPageHero from "../Components/PublicPageHero";
import AboutContent from "./components/AboutContent";
import CommunityDevelopment from "./components/CommunityDevelopment";
import EconomicImpact from "./components/EconomicImpact";
import InnovationDiversity from "./components/InnovationDiversity";
import Mission from "./components/Mission";
import Vision from "./components/Vision";
import HowItWorks from "./components/HowitWorks";


export default function AboutPage() {
  return (
    <main className="flex w-full flex-col">
      <PublicPageHero
        title="About"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        imageUrl="/about.png"
      />
      <AboutContent/>
      <EconomicImpact/>
      <CommunityDevelopment/>
      <HowItWorks/>
      <InnovationDiversity/>
      <Mission/>
      {/* <Vision/> */}
    </main>
  );
}
