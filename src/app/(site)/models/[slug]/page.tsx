import type { Metadata } from "next";

import { VehicleDetail } from "@/components/vehicles/vehicle-detail";
import { seedVehicles } from "@/lib/mock/vehicles";
import { formatPrice } from "@/lib/utils";

type ModelPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = seedVehicles.find((item) => item.slug === slug);

  if (!vehicle) {
    const readable = slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return {
      title: readable || "Ficha del modelo",
      description: "Consulta la ficha técnica y cotiza por WhatsApp.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: vehicle.name,
    description: `${vehicle.name} ${vehicle.category} desde ${formatPrice(vehicle.price)}. ${vehicle.specs.engine}, ${vehicle.specs.power}, ${vehicle.specs.transmission}. Cotiza por WhatsApp.`,
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;

  return <VehicleDetail slug={slug} />;
}
