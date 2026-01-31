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
      {/* <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <h1 className="text-3xl font-bold leading-loose text-white md:text-5xl font-heading">
          {heading}
        </h1>
      </div> */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
        <h1 className="text-3xl font-bold leading-loose text-white md:text-5xl font-poppins">
          DELICIOUS FOOD AND GROCERY
        </h1>
        <h1 className="text-base  leading-loose text-[#A2A2A2] font-poppins">
          Home // Food and Grocery
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
