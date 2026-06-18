import Hero from "./Components/Hero";
import TrustBar from "./Components/TrustBar";
import HomeSearchSection from "./Components/HomeSearchSection";
import BrowseByCategory from "./Components/BrowseByCategory";
import ShopProducts from "./Components/ShopProducts";
import { CulturalDiscoveryCollections, VendorSpotlightSection, VendorStoriesSection } from "./Components/CulturalDiscovery";
import HowItWorksImage from "./Components/HowitWorks";
import VendorCtaBand from "./Components/VendorCtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HomeSearchSection />
      <BrowseByCategory />
      <ShopProducts />
      <CulturalDiscoveryCollections />
      <VendorSpotlightSection />
      <HowItWorksImage />
      <VendorCtaBand />
      <VendorStoriesSection />
    </>
  );
}
