"use client";

import Image from "next/image";
import { useState } from "react";

type AspectRatio = "square" | "video";

export interface MarketImageProps {
  src?: string | null;
  alt: string;
  aspect?: AspectRatio;
  objectFit?: "cover" | "contain";
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
}

const aspectClasses: Record<AspectRatio, string> = {
  square: "aspect-square",
  video: "aspect-video",
};

export default function MarketImage({
  src,
  alt,
  aspect = "square",
  objectFit = "cover",
  className = "",
  fallbackLabel = "No image",
  priority = false,
}: MarketImageProps) {
  const [broken, setBroken] = useState(false);
  const showFallback = !src || broken;

  return (
    <div className={`market-card-media relative ${aspectClasses[aspect]} ${className}`}>
      {showFallback ? (
        <div className="market-card-placeholder">{fallbackLabel}</div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={objectFit === "contain" ? "object-contain p-2" : "object-cover"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}
