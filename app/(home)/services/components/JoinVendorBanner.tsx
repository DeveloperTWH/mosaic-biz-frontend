import Image from "next/image";
import Link from "next/link";

const JoinVendorBanner = () => {
  return (
    <div className="relative flex justify-center px-4 pb-16 pt-8">
      <Image src="/BannerJoin.png" alt="Join as a vendor" height={128} width={1024} className="max-w-full h-auto" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <Link href="/become-a-vendor" className="market-btn-primary whitespace-nowrap text-sm">
          Become A Vendor
        </Link>
      </div>
    </div>
  );
};

export default JoinVendorBanner;
