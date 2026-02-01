import AboutMinority from "./Components/AboutMinority";
import BookServices from "./Components/BookServices";
import BrowseFoodAndGrocery from "./Components/BrowsbyFoodndGrocerry";
import BrowseServices from "./Components/BrowsServices";
import ClientTestimonials from "./Components/ClientTestimonials";
import FAQSection from "./Components/FaQ";
import FeatureBlogs from "./Components/FeatureBlogs";
import FreshnessSection from "./Components/FreshnessSection";
import Hero from "./Components/Hero";
import HowItWorksImage from "./Components/HowitWorks";
import HowWeWork from "./Components/HowWeWork";
import Product from "./Components/Product";
import PromoCarousel from "./Components/PromoCarousel";
import ShopProducts from "./Components/ShopProducts";
import WhyChooseUs from "./Components/WhyChooseUs";


export default function Home() {
  return (
    <>
      <Hero />
      <ShopProducts />
      <BrowseServices showAllService={true}/>
      <BrowseFoodAndGrocery/>
      <HowItWorksImage/>
      <ClientTestimonials />
      {/* <Product />
      <AboutMinority />
      <BookServices />
      <HowWeWork />
      <WhyChooseUs/>
      <PromoCarousel/>
      <FreshnessSection />
      <FAQSection/>
      <FeatureBlogs/> */}
    </>
  );
}
