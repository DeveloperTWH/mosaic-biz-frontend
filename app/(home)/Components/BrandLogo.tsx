import Image from "next/image";

type BrandLogoProps = {
  variant?: "header" | "footer";
  priority?: boolean;
};

const SIZES = {
  header: "h-10 w-auto max-w-[min(280px,60vw)] sm:h-11",
  footer: "h-12 w-auto max-w-[min(320px,70vw)] sm:h-14",
} as const;

export default function BrandLogo({ variant = "header", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/mosaic-biz-hub-logo-transparent.png"
      alt="Mosaic Biz Hub"
      width={800}
      height={200}
      priority={priority}
      className={`${SIZES[variant]} object-contain object-left drop-shadow-[0_0_12px_rgba(237,231,255,0.2)]`}
    />
  );
}
