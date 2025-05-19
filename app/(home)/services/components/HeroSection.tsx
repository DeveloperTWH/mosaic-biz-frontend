import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="w-full relative">
      <Image
        src="/Service/Banner.png"
        alt="Service Hero"
        width={1920}  // adjust to actual image width
        height={500}  // adjust to actual image height
        className="w-full h-auto"
      />
    </section>
  );
};

export default HeroSection;
