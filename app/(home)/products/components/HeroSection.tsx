import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full">
      <Image
        src="/products/product_banner.png"
        alt="Product Hero"
        width={1920}  // adjust to actual image width
        height={500}  // adjust to actual image height
        className="w-full h-auto"
      />
    </section>
  );
};

export default HeroSection;
