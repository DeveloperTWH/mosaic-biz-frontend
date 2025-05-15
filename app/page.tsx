import AboutMinority from "./Components/AboutMinority";
import BookServices from "./Components/BookServices";
import Hero from "./Components/Hero";
import HowWeWork from "./Components/HowWeWork";
import Product from "./Components/Product";
import PromoCarousel from "./Components/PromoCarousel";
import ShopProducts from "./Components/ShopProducts";
import WhyChooseUs from "./Components/WhyChooseUs";


export default function Home() {
  return (
    <>
      <Hero />
      <Product />
      <ShopProducts />
      <AboutMinority />
      <BookServices />
      <HowWeWork />
      <WhyChooseUs/>
      <PromoCarousel/>
    </>
  );
}
