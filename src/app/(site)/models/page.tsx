import type { Metadata } from "next";

import { CatalogView } from "@/components/vehicles/catalog-view";
import { VEHICLE_CATEGORIES, type VehicleCategory } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Modelos",
  description:
    "Catálogo de SUVs, pickups, sedanes, hatchbacks y eléctricos con precio de lista y cotización por WhatsApp.",
};

type CatalogPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category } = await searchParams;
  const initialCategory = VEHICLE_CATEGORIES.includes(category as VehicleCategory)
    ? (category as VehicleCategory)
    : undefined;

  return (
    <CatalogView
      key={initialCategory ?? "all"}
      initialCategory={initialCategory}
    />
  );
}
