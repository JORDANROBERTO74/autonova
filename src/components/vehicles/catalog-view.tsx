"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { useVehicles } from "@/components/vehicles/vehicles-provider";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Button } from "@/components/ui/button";
import {
  VEHICLE_CATEGORIES,
  categoryCounts,
  type VehicleCategory,
} from "@/lib/vehicles";
import { cn } from "@/lib/utils";

type CatalogFilter = VehicleCategory | "Todos";

export function CatalogView({ initialCategory }: { initialCategory?: VehicleCategory }) {
  const { vehicles } = useVehicles();
  const [filter, setFilter] = useState<CatalogFilter>(initialCategory ?? "Todos");
  const counts = categoryCounts(vehicles);

  const filtered =
    filter === "Todos"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.category === filter);

  const filters: CatalogFilter[] = ["Todos", ...VEHICLE_CATEGORIES];

  function changeFilter(next: CatalogFilter) {
    setFilter(next);

    const params = new URLSearchParams(window.location.search);
    if (next === "Todos") {
      params.delete("category");
    } else {
      params.set("category", next);
    }
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/models?${query}` : "/models");
  }

  return (
    <div className="shell py-12 lg:py-16">
      <div className="flex flex-col gap-8 border-b border-ink/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="display-title text-5xl sm:text-6xl lg:text-7xl">
            Modelos en piso
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-steel">
            Precio de lista, ficha técnica y disponibilidad inmediata. Elige un
            modelo y la cotización se abre directo en WhatsApp.
          </p>
        </div>
        <p className="font-mono text-sm tabular-nums text-steel" aria-live="polite">
          {String(filtered.length).padStart(2, "0")} de{" "}
          {String(vehicles.length).padStart(2, "0")} modelos
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 py-6">
        <span className="mr-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-steel">
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Filtrar
        </span>
        {filters.map((item) => {
          const count = item === "Todos" ? vehicles.length : (counts[item] ?? 0);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => changeFilter(item)}
              className={cn(
                "inline-flex items-center gap-2 border px-3.5 py-2 text-sm font-medium transition-colors",
                filter === item
                  ? "border-ink bg-ink text-chalk"
                  : "border-ink/15 bg-transparent text-foreground hover:border-ink/40",
              )}
            >
              {item}
              <span
                className={cn(
                  "font-mono text-[11px] tabular-nums",
                  filter === item ? "text-chalk/60" : "text-steel",
                )}
              >
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          <h2 className="sr-only">Resultados del catálogo</h2>
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center border border-dashed border-ink/20 px-6 py-20 text-center">
          <p className="font-display text-3xl uppercase">
            {filter === "Todos" ? "Aún no hay modelos publicados" : "Sin modelos en esta categoría"}
          </p>
          <p className="mt-3 max-w-sm text-sm text-steel">
            {filter === "Todos"
              ? "El catálogo está en actualización. Escríbenos y te compartimos disponibilidad y precios."
              : "Prueba con otra categoría o revisa el catálogo completo."}
          </p>
          {filter === "Todos" ? (
            <WhatsAppButton
              message="Hola, quiero saber qué modelos tienen disponibles en AutoNova."
              className="mt-6"
            />
          ) : (
            <Button type="button" onClick={() => changeFilter("Todos")} className="mt-6">
              Ver todos los modelos
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
