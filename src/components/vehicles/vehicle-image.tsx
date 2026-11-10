/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";

type VehicleImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

// shortcut: only catalog photos have 400/800/1200 variants; a new local URL uses the full original.
const responsiveImages = new Set([
  "q7",
  "rav4",
  "jeep",
  "range-rover",
  "chr",
  "f150-blue",
  "ram-white",
  "raptor",
  "tacoma",
  "sonata",
  "mercedes-sedan",
  "bmw-m3",
  "amg-gt",
  "fiat500",
  "golf",
  "tesla3",
  "taycan",
]);

function localSrcSet(src: string): string | undefined {
  if (!src.startsWith("/vehicles/") || !src.endsWith(".jpg")) return undefined;

  const name = src.slice("/vehicles/".length, -4);
  if (!responsiveImages.has(name)) return undefined;

  const base = `/vehicles/${name}`;
  return `${base}-400.jpg 400w, ${base}-800.jpg 800w, ${base}-1200.jpg 1200w, ${src} 1600w`;
}

export function VehicleImage({
  src,
  alt,
  className,
  priority,
  sizes = "100vw",
}: VehicleImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} — imagen no disponible` : "Imagen no disponible"}
        className={cn(
          "flex h-full w-full items-center justify-center bg-muted text-steel",
          className,
        )}
      >
        <ImageOff className="size-6" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={1600}
      height={1100}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      sizes={sizes}
      srcSet={localSrcSet(src)}
      onError={() => setFailedSrc(src)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
