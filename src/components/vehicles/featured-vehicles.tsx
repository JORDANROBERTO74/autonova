"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useVehicles } from "@/components/vehicles/vehicles-provider";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function FeaturedVehicles() {
  const { vehicles } = useVehicles();
  const featured = vehicles.slice(0, 3);

  if (featured.length === 0) {
    return (
      <section className="shell py-16 lg:py-24" aria-labelledby="featured-title">
        <h2 id="featured-title" className="display-title text-4xl sm:text-5xl lg:text-6xl">
          Inventario en actualización
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-steel">
          Estamos preparando la siguiente lista de unidades. Escríbenos y te
          compartimos disponibilidad y precios en cuanto estén publicados.
        </p>
        <WhatsAppButton
          message="Hola, quiero saber qué modelos tienen disponibles en AutoNova."
          size="lg"
          className="mt-7"
        />
      </section>
    );
  }

  return (
    <section className="shell py-16 lg:py-24" aria-labelledby="featured-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="featured-title" className="display-title text-4xl sm:text-5xl lg:text-6xl">
            {featured.length === 3 ? "Tres que no duran" : "En piso ahora"}
          </h2>
        </div>
        <Link
          href="/models"
          className="group inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-sm font-medium transition-colors hover:border-signal-ink hover:text-signal-ink"
        >
          Ver catálogo completo
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
