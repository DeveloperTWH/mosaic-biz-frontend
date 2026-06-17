import Hero from "./Components/Hero";
import TrustBar from "./Components/TrustBar";
import HomeSearchSection from "./Components/HomeSearchSection";
import BrowseByCategory from "./Components/BrowseByCategory";
import ShopProducts from "./Components/ShopProducts";
import VendorSpotlightComingSoon from "./Components/VendorSpotlightComingSoon";
import HowItWorksImage from "./Components/HowitWorks";
import VendorCtaBand from "./Components/VendorCtaBand";
import VendorStoriesComingSoon from "./Components/VendorStoriesComingSoon";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HomeSearchSection />
      <BrowseByCategory />
      <ShopProducts />
      <VendorSpotlightComingSoon />
      <HowItWorksImage />
      <VendorCtaBand />
      <VendorStoriesComingSoon />
    </>
  );
}
