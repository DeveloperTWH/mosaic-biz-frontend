import type { Metadata } from "next";

export const SITE_NAME = "Mosaic Biz Hub";
export const DEFAULT_SITE_DESCRIPTION =
  "Discover and support trusted minority-owned businesses. Shop products, book services, and explore food from verified vendors on Mosaic Biz Hub.";
export const DEFAULT_SHARE_IMAGE = "/herobanner.png";
export const DEFAULT_SITE_URL = "https://mosaicbizhub.com";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export function getMetadataBase(): URL {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL;

  try {
    return new URL(rawUrl);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function normalizeCanonicalPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_SHARE_IMAGE,
  imageAlt = `${SITE_NAME} marketplace preview`,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonicalPath = normalizeCanonicalPath(path);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalPath,
      images: [
        {
          url: image,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
