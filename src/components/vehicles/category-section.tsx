"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useVehicles } from "@/components/vehicles/vehicles-provider";
import { VEHICLE_CATEGORIES, categoryCounts } from "@/lib/vehicles";

const representedBrands = [
  "Kestrel",
  "Vanta",
  "Ridge",
  "Marlow",
  "Orbita",
  "Aster",
];

export function CategorySection() {
  const { vehicles } = useVehicles();
  const counts = categoryCounts(vehicles);

  return (
    <section className="border-y border-ink/10 bg-card" aria-labelledby="categories-title">
      <div className="shell grid gap-12 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
        <div>
          <h2 id="categories-title" className="display-title text-4xl sm:text-5xl lg:text-6xl">
            Encuentra tu formato
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel">
            Seis marcas representadas y cinco categorías. Filtra por lo que
            necesitas y cotiza sin intermediarios.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink/10 pt-6">
            {representedBrands.map((brand) => (
              <span
                key={brand}
                className="font-display text-xl uppercase tracking-wide text-ink/60"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {VEHICLE_CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={`/models?category=${encodeURIComponent(category)}`}
                className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-signal-ink"
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-display text-3xl uppercase leading-none sm:text-4xl">
                    {category}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-label text-steel">
                    {String(counts[category] ?? 0).padStart(2, "0")}{" "}
                    {counts[category] === 1 ? "modelo" : "modelos"}
                  </span>
                </span>
                <ArrowUpRight
                  className="size-5 shrink-0 text-steel transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-ink"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
