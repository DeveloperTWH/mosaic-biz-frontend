// components/BannerSection.jsx
import Image from "next/image";

export default function BannerSection() {
  return (
    <section className="w-full">
      <div className="relative w-full">
        <Image
          src="/Search/banner.png" // Adjust path if needed
          alt="New Arrival Fashion Banner"
          width={1920}
          height={442}
          layout="responsive"
          priority
        />
      </div>
    </section>
  );
}
