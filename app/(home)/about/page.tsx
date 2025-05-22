import HeroSection from "../services/components/HeroSection";
import AboutContent from "./components/AboutContent";
import CommunityDevelopment from "./components/CommunityDevelopment";
import EconomicImpact from "./components/EconomicImpact";
import InnovationDiversity from "./components/InnovationDiversity";
import Mission from "./components/Mission";
import Vision from "./components/Vision";


export default function AboutPage() {
  return (
    <main className="flex flex-col items-center w-full">
      <HeroSection/>
      <AboutContent/>
      <EconomicImpact/>
      <CommunityDevelopment/>
      <InnovationDiversity/>
      <Mission/>
      <Vision/>
    </main>
  );
}
