import Hero from "./Components/Hero";
import TrustBar from "./Components/TrustBar";
import HomeSearchSection from "./Components/HomeSearchSection";
import BrowseByCategory from "./Components/BrowseByCategory";
import ShopProducts from "./Components/ShopProducts";
import { CulturalDiscoveryCollections, VendorSpotlightSection, VendorStoriesSection } from "./Components/CulturalDiscovery";
import HowItWorksImage from "./Components/HowitWorks";
import VendorCtaBand from "./Components/VendorCtaBand";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Where Culture and Commerce Connect",
  description:
    "Discover trusted minority-owned businesses, shop products, book services, and explore food vendors on Mosaic Biz Hub.",
  path: "/",
});

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
