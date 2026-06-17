import Image from "next/image";

interface BannerSectionProps {
  heading: string;
  imageUrl: string;
}

const BannerSection = ({ heading, imageUrl }: BannerSectionProps) => {
  return (
    <section className="relative h-[300px] w-full overflow-hidden border-b border-white/10 bg-market-bg md:h-[500px]">
      <Image
        src={imageUrl}
        alt={heading}
        fill
        priority
        className="h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-market-hero" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-market-glow-radial"
        aria-hidden
      />
    </section>
  );
};

export default BannerSection;
