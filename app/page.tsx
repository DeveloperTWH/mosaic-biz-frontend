import AboutMinority from "./Components/AboutMinority";
import BookServices from "./Components/BookServices";
import Hero from "./Components/Hero";
import HowWeWork from "./Components/HowWeWork";
import Product from "./Components/Product";
import ShopProducts from "./Components/ShopProducts";


export default function Home() {
  return (
    <>
      <Hero />
      <Product />
      <ShopProducts />
      <AboutMinority />
      <BookServices />
      <HowWeWork />
    </>
  );
}
