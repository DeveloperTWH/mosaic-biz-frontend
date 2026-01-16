import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[100px] md:h-[500px]">
      <Image
        src="/shopproducts/shopproducthero.png"
        alt="Product Hero"
        fill
        priority
        className="object-cover w-full h-full"
      />
    </section>
  );
};

export default HeroSection;

