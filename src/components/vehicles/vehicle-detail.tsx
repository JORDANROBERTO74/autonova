"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

import { VehicleImage } from "@/components/vehicles/vehicle-image";
import { SpecTable } from "@/components/vehicles/spec-table";
import { useVehicles } from "@/components/vehicles/vehicles-provider";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { quoteMessage } from "@/lib/whatsapp";
import { vehicleGallery } from "@/lib/vehicles";

export function VehicleDetail({ slug }: { slug: string }) {
  const { vehicles, hydrated } = useVehicles();
  const vehicle = vehicles.find((item) => item.slug === slug);

  const gallery = vehicle ? vehicleGallery(vehicle) : [];
  const variants = vehicle?.specs.variants ?? [];
  const colors = vehicle?.specs.colors ?? [];

  const defaultVariant = variants[0] ?? "";
  const defaultColor = colors[0]?.name ?? "";

  const [imageIndex, setImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const vehicleId = vehicle?.id;

  useEffect(() => {
    setImageIndex(0);
    setSelectedVariant(defaultVariant);
    setSelectedColor(defaultColor);
  }, [vehicleId, defaultVariant, defaultColor]);

  if (!vehicle) {
    if (!hydrated) {
      return (
        <div className="shell py-16" aria-busy="true" aria-label="Cargando modelo">
          <div className="h-4 w-40 animate-pulse bg-muted" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-4">
              <div className="h-12 w-3/4 animate-pulse bg-muted" />
              <div className="h-6 w-1/2 animate-pulse bg-muted" />
              <div className="h-40 animate-pulse bg-muted" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="shell flex flex-col items-center py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-title mt-3 text-5xl">Modelo no encontrado</h1>
        <p className="mt-4 max-w-md text-sm text-steel">
          Puede que el modelo ya no esté en el catálogo. Revisa los disponibles
          y cotiza el que te interese.
        </p>
        <Button asChild className="mt-8">
          <Link href="/models">Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  const message = quoteMessage(vehicle.name, {
    variant: selectedVariant || undefined,
    color: selectedColor || undefined,
  });
  const activeColor = colors.find((color) => color.name === selectedColor);
  const thumbnailColumns =
    gallery.length === 2
      ? "grid-cols-2"
      : gallery.length === 3
        ? "grid-cols-3"
        : "grid-cols-4";

  return (
    <div className="shell py-10 lg:py-14">
      <Link
        href="/models"
        className="inline-flex items-center gap-2 text-sm text-steel transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Catálogo
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-14 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink">
            <VehicleImage
              src={gallery[imageIndex] ?? vehicle.image_url}
              alt={`${vehicle.name} — foto ${imageIndex + 1} de ${gallery.length}`}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <span className="absolute left-4 top-4 bg-ink/90 px-2.5 py-1 font-mono text-[11px] uppercase tracking-label text-chalk">
              {vehicle.category}
            </span>
          </div>

          {gallery.length > 1 ? (
            <div className={`mt-3 grid ${thumbnailColumns} gap-3`} role="group" aria-label="Galería de fotos">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Ver foto ${index + 1} de ${vehicle.name}`}
                  aria-pressed={imageIndex === index}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden border-2 transition-opacity",
                    imageIndex === index
                      ? "border-signal opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <VehicleImage src={image} alt="" sizes="120px" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <h1 className="display-title text-5xl sm:text-6xl">{vehicle.name}</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-label text-steel">
            {vehicle.category} · 2025
          </p>
          <p className="mt-5 font-mono text-2xl tabular-nums">{formatPrice(vehicle.price)}</p>
          <p className="mt-1 text-xs text-steel">
            Precio de lista. La cotización final se confirma por WhatsApp.
          </p>

          {variants.length > 0 ? (
            <fieldset className="mt-8 border-t border-ink/10 pt-6">
              <legend className="telemetry-label">Variante</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    aria-pressed={selectedVariant === variant}
                    className={cn(
                      "border px-4 py-2 text-sm font-medium transition-colors",
                      selectedVariant === variant
                        ? "border-ink bg-ink text-chalk"
                        : "border-ink/20 hover:border-ink/50",
                    )}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {colors.length > 0 ? (
            <fieldset className="mt-6 border-t border-ink/10 pt-6">
              <legend className="telemetry-label">
                Color{activeColor ? ` · ${activeColor.name}` : ""}
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    aria-pressed={selectedColor === color.name}
                    aria-label={`Color ${color.name}`}
                    className={cn(
                      "inline-flex items-center gap-2 border px-3 py-2 text-xs font-medium transition-colors",
                      selectedColor === color.name
                        ? "border-ink bg-ink text-chalk"
                        : "border-ink/20 hover:border-ink/50",
                    )}
                  >
                    <span
                      className="size-4 rounded-full border border-ink/20"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    {color.name}
                    {selectedColor === color.name ? (
                      <Check className="size-3.5" aria-hidden="true" />
                    ) : null}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="mt-8 border-t border-ink/10 pt-6">
            <WhatsAppButton message={message} size="lg" className="w-full">
              Cotizar por WhatsApp
            </WhatsAppButton>
            <p className="mt-3 text-center text-xs text-steel">
              Se abre WhatsApp con el mensaje: “{message}”
            </p>
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-2 lg:mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display-title text-3xl">Ficha técnica</h2>
            {vehicle.specs.seats ? (
              <span className="font-mono text-[11px] uppercase tracking-label text-steel">
                {vehicle.specs.seats} plazas
              </span>
            ) : null}
          </div>
          <div className="mt-5">
            <SpecTable vehicle={vehicle} />
          </div>
        </div>
      </div>
    </div>
  );
}
