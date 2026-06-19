import Image from "next/image";

type BrandLogoProps = {
  variant?: "header" | "footer";
  priority?: boolean;
};

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 1024;

const SIZES = {
  header: "h-9 w-9 sm:h-10 sm:w-10",
  footer: "h-12 w-12 sm:h-14 sm:w-14",
} as const;

export default function BrandLogo({ variant = "header", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/mosaic-brand-logo.png"
      alt="Mosaic Biz Hub"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={`${SIZES[variant]} object-contain object-left`}
    />
  );
}
