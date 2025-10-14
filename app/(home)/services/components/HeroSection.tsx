import Image from "next/image";

interface HeroSectionProps {
  heading: string;
  imageUrl: string;
}

const HeroSection = ({ heading, imageUrl }: HeroSectionProps) => {
  return (
    <section className="relative w-full h-[300px] md:h-[500px]">
      <Image
        src={imageUrl}
        alt={heading}
        fill
        priority
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <h1 className="text-3xl font-bold leading-loose text-white md:text-5xl font-heading">
          {heading}
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
