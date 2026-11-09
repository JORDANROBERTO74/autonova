import type { Metadata } from "next";

import { VehicleForm } from "@/components/admin/vehicle-form";

export const metadata: Metadata = {
  title: "Editar modelo",
};

type EditVehiclePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params;

  return <VehicleForm vehicleId={id} />;
}
