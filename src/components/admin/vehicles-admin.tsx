"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useVehicles } from "@/components/vehicles/vehicles-provider";
import { VehicleImage } from "@/components/vehicles/vehicle-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import type { Vehicle } from "@/lib/vehicles";
import { formatPrice } from "@/lib/utils";

export function VehiclesAdmin() {
  const { vehicles, hydrated, deleteVehicle, resetVehicles } = useVehicles();
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteVehicle(pendingDelete.id);
    toast.success(`“${pendingDelete.name}” se eliminó del catálogo.`);
    setPendingDelete(null);
  }

  function confirmReset() {
    resetVehicles();
    setResetOpen(false);
    toast.success("Catálogo restaurado.");
  }

  return (
    <div className="shell py-10 lg:py-14">
      <div className="flex flex-col gap-6 border-b border-ink/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display-title text-4xl sm:text-5xl">Vehículos</h1>
          <p className="mt-3 max-w-xl text-sm text-steel">
            Crea, edita y elimina modelos. Los cambios se reflejan en el sitio
            y se guardan en este navegador.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={() => setResetOpen(true)}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Restaurar catálogo
          </Button>
          <Button asChild>
            <Link href="/admin/vehicles/new">
              <Plus className="size-4" aria-hidden="true" />
              Nuevo modelo
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-label text-steel">
          {String(vehicles.length).padStart(2, "0")}{" "}
          {vehicles.length === 1 ? "modelo" : "modelos"}
        </p>
      </div>

      {!hydrated ? (
        <div className="mt-4 space-y-2 border border-ink/10 bg-card p-4" aria-busy="true" aria-label="Cargando vehículos">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="h-14 animate-pulse bg-muted" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="mt-4 flex flex-col items-center border border-dashed border-ink/20 bg-card px-6 py-16 text-center">
          <p className="font-display text-3xl uppercase">Catálogo vacío</p>
          <p className="mt-3 max-w-sm text-sm text-steel">
            Agrega un modelo o restaura el catálogo para volver a empezar.
          </p>
          <Button asChild className="mt-6">
            <Link href="/admin/vehicles/new">Crear el primero</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 border border-ink/10 bg-card">
          <Table>
            <TableCaption className="sr-only">
              Modelos registrados en el catálogo
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead className="hidden md:table-cell">Categoría</TableHead>
                <TableHead className="hidden sm:table-cell">Precio</TableHead>
                <TableHead className="hidden lg:table-cell">Especificaciones</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="relative h-11 w-16 shrink-0 overflow-hidden bg-muted">
                        <VehicleImage src={vehicle.image_url} alt="" sizes="64px" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{vehicle.name}</span>
                        <span className="mt-0.5 block truncate font-mono text-[11px] uppercase tracking-label text-steel">
                          /{vehicle.slug}
                        </span>
                        <span className="mt-1 block font-mono text-xs tabular-nums text-steel sm:hidden">
                          {formatPrice(vehicle.price)}
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="font-mono text-[11px] uppercase tracking-label text-steel">
                      {vehicle.category}
                    </span>
                  </TableCell>
                  <TableCell className="hidden font-mono text-sm tabular-nums sm:table-cell">
                    {formatPrice(vehicle.price)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-steel">
                      {vehicle.specs.motor} · {vehicle.specs.potencia} ·{" "}
                      {vehicle.specs.transmision}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon">
                        <Link
                          href={`/admin/vehicles/${vehicle.id}/edit`}
                          aria-label={`Editar ${vehicle.name}`}
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setPendingDelete(vehicle)}
                        aria-label={`Eliminar ${vehicle.name}`}
                        className="text-steel hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar “{pendingDelete?.name}”?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se quitará del catálogo de este navegador. Puedes restaurar
              todos los datos con “Restaurar catálogo”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar catálogo</AlertDialogTitle>
            <AlertDialogDescription>
              Se descartarán tus cambios y volverán los 8 modelos originales.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
