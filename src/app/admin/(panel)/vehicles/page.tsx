import type { Metadata } from "next";

import { VehiclesAdmin } from "@/components/admin/vehicles-admin";

export const metadata: Metadata = {
  title: "Vehículos",
};

export default function AdminVehiclesPage() {
  return <VehiclesAdmin />;
}
