"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { seedVehicles } from "@/lib/mock/vehicles";
import { VEHICLE_CATEGORIES, type Vehicle, type VehicleInput } from "@/lib/vehicles";

const STORAGE_KEY = "autonova.vehicles.v1";

export type VehiclesResult = { ok: true } | { ok: false; error: string };

type VehiclesContextValue = {
  vehicles: Vehicle[];
  hydrated: boolean;
  createVehicle: (input: VehicleInput) => VehiclesResult;
  updateVehicle: (id: string, input: VehicleInput) => VehiclesResult;
  deleteVehicle: (id: string) => void;
  resetVehicles: () => void;
};

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

function isVehicle(value: unknown): value is Vehicle {
  if (!value || typeof value !== "object") return false;

  const vehicle = value as Record<string, unknown>;
  const specs = vehicle.specs;

  return (
    typeof vehicle.id === "string" &&
    typeof vehicle.name === "string" &&
    typeof vehicle.slug === "string" &&
    VEHICLE_CATEGORIES.includes(vehicle.category as Vehicle["category"]) &&
    typeof vehicle.price === "number" &&
    Number.isFinite(vehicle.price) &&
    typeof vehicle.image_url === "string" &&
    Boolean(specs) &&
    typeof specs === "object"
  );
}

export function VehiclesProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(isVehicle);
          if (parsed.length === 0 || valid.length > 0) setVehicles(valid);
        }
      }
    } catch {
      // localStorage puede estar bloqueado; seguimos con el seed.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch {
      // Sin persistencia disponible; la app sigue funcionando en memoria.
    }
  }, [vehicles, hydrated]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || event.newValue === null) return;

      try {
        const parsed: unknown = JSON.parse(event.newValue);
        if (!Array.isArray(parsed)) return;

        const valid = parsed.filter(isVehicle);
        if (parsed.length === 0 || valid.length > 0) setVehicles(valid);
      } catch {
        // Ignoramos datos externos corruptos.
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const createVehicle = useCallback(
    (input: VehicleInput): VehiclesResult => {
      if (vehicles.some((vehicle) => vehicle.slug === input.slug)) {
        return { ok: false, error: "Ya existe un modelo con ese slug." };
      }

      setVehicles((current) => [
        { ...input, id: crypto.randomUUID() },
        ...current,
      ]);
      return { ok: true };
    },
    [vehicles],
  );

  const updateVehicle = useCallback(
    (id: string, input: VehicleInput): VehiclesResult => {
      if (!vehicles.some((vehicle) => vehicle.id === id)) {
        return { ok: false, error: "El modelo ya no existe." };
      }
      if (
        vehicles.some(
          (vehicle) => vehicle.slug === input.slug && vehicle.id !== id,
        )
      ) {
        return { ok: false, error: "Ya existe otro modelo con ese slug." };
      }

      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.id === id ? { ...input, id } : vehicle,
        ),
      );
      return { ok: true };
    },
    [vehicles],
  );

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
  }, []);

  const resetVehicles = useCallback(() => {
    setVehicles(seedVehicles);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nada que limpiar.
    }
  }, []);

  const value = useMemo(
    () => ({
      vehicles,
      hydrated,
      createVehicle,
      updateVehicle,
      deleteVehicle,
      resetVehicles,
    }),
    [
      vehicles,
      hydrated,
      createVehicle,
      updateVehicle,
      deleteVehicle,
      resetVehicles,
    ],
  );

  return (
    <VehiclesContext.Provider value={value}>
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error("useVehicles debe usarse dentro de <VehiclesProvider>.");
  }
  return context;
}
