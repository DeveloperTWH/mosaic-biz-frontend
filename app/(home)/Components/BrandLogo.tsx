import Image from "next/image";

type BrandLogoProps = {
  variant?: "header" | "footer";
  priority?: boolean;
};

const LOGO_WIDTH = 1000;
const LOGO_HEIGHT = 129;

const SIZES = {
  header: "h-9 w-auto max-w-[min(240px,55vw)] sm:h-10",
  footer: "h-12 w-auto max-w-[min(320px,70vw)] sm:h-14",
} as const;

export default function BrandLogo({ variant = "header", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/mosaic-biz-hub-logo-transparent.png"
      alt="Mosaic Biz Hub"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={`${SIZES[variant]} object-contain object-left`}
    />
  );
}
