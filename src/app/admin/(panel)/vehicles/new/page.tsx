import type { Metadata } from "next";

import { VehicleForm } from "@/components/admin/vehicle-form";

export const metadata: Metadata = {
  title: "Nuevo modelo",
};

export default function NewVehiclePage() {
  return <VehicleForm />;
}
