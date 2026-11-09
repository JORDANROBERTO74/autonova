"use client";

import Link from "next/link";
import { ArrowRight, Pencil, Plus } from "lucide-react";

import { useVehicles } from "@/components/vehicles/vehicles-provider";
import { VehicleImage } from "@/components/vehicles/vehicle-image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";

export function AdminDashboard() {
  const { vehicles } = useVehicles();

  const total = vehicles.length;
  const categoryCount = new Set(vehicles.map((vehicle) => vehicle.category)).size;
  const inventoryValue = vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0);
  const averagePrice = total > 0 ? inventoryValue / total : 0;
  const recent = vehicles.slice(0, 5);

  const stats = [
    { label: "Modelos", value: String(total).padStart(2, "0") },
    { label: "Categorías", value: String(categoryCount).padStart(2, "0") },
    { label: "Precio promedio", value: formatPrice(averagePrice) },
    { label: "Valor del inventario", value: formatPrice(inventoryValue) },
  ];

  return (
    <div className="shell py-10 lg:py-14">
      <div className="flex flex-col gap-6 border-b border-ink/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display-title text-4xl sm:text-5xl">Dashboard</h1>
          <p className="mt-3 max-w-xl text-sm text-steel">
            Resumen del catálogo y accesos rápidos.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/vehicles">Gestionar vehículos</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/vehicles/new">
              <Plus className="size-4" aria-hidden="true" />
              Nuevo modelo
            </Link>
          </Button>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-px border-y border-ink/10 bg-ink/10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 bg-card p-4 sm:p-5">
            <dt className="telemetry-label">{stat.label}</dt>
            <dd
              className="mt-2 truncate font-mono text-xl tabular-nums sm:text-2xl"
              title={stat.value}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-10" aria-labelledby="recent-title">
        <div className="flex items-end justify-between gap-4">
          <h2 id="recent-title" className="display-title text-2xl">
            Últimos modelos
          </h2>
          <Link
            href="/admin/vehicles"
            className="group inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-sm font-medium transition-colors hover:border-signal-ink hover:text-signal-ink"
          >
            Ver todos
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="mt-5 border border-ink/10 bg-card">
            <Table>
              <TableCaption className="sr-only">
                Últimos modelos del catálogo
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo</TableHead>
                  <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                  <TableHead className="hidden sm:table-cell">Precio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden bg-muted">
                          <VehicleImage
                            src={vehicle.image_url}
                            alt=""
                            sizes="64px"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium">
                            {vehicle.name}
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[11px] uppercase tracking-label text-steel">
                            /{vehicle.slug}
                          </span>
                          <span className="mt-1 block font-mono text-xs tabular-nums text-steel sm:hidden">
                            {formatPrice(vehicle.price)}
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="font-mono text-[11px] uppercase tracking-label text-steel">
                        {vehicle.category}
                      </span>
                    </TableCell>
                    <TableCell className="hidden font-mono text-sm tabular-nums sm:table-cell">
                      {formatPrice(vehicle.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            href={`/admin/vehicles/${vehicle.id}/edit`}
                            aria-label={`Editar ${vehicle.name}`}
                          >
                            <Pencil className="size-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center border border-dashed border-ink/20 bg-card px-6 py-14 text-center">
            <p className="font-display text-3xl uppercase">Aún no hay modelos</p>
            <p className="mt-3 max-w-sm text-sm text-steel">
              Crea el primer modelo para empezar a construir el catálogo.
            </p>
            <Button asChild className="mt-6">
              <Link href="/admin/vehicles/new">Crear el primero</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
