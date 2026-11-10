import { z } from "zod";

export const VEHICLE_CATEGORIES = [
  "SUV",
  "Pickup",
  "Sedán",
  "Hatchback",
  "Eléctrico",
] as const;

export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export type VehicleColor = {
  name: string;
  hex: string;
};

export type VehicleSpecs = {
  engine: string;
  power: string;
  transmission: string;
  drivetrain: string;
  fuel?: string;
  torque?: string;
  seats?: number;
  warranty?: string;
  gallery?: string[];
  variants?: string[];
  colors?: VehicleColor[];
};

export type Vehicle = {
  id: string;
  name: string;
  slug: string;
  category: VehicleCategory;
  price: number;
  image_url: string;
  specs: VehicleSpecs;
};

type LegacySpecs = Partial<VehicleSpecs> & {
  motor?: unknown;
  potencia?: unknown;
  transmision?: unknown;
  traccion?: unknown;
  combustible?: unknown;
  plazas?: unknown;
  garantia?: unknown;
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function normalizeVehicle(vehicle: Vehicle): Vehicle {
  const specs = vehicle.specs as LegacySpecs;

  return {
    ...vehicle,
    specs: {
      engine: specs.engine ?? asString(specs.motor) ?? "",
      power: specs.power ?? asString(specs.potencia) ?? "",
      transmission:
        specs.transmission ?? asString(specs.transmision) ?? "",
      drivetrain: specs.drivetrain ?? asString(specs.traccion) ?? "",
      fuel: specs.fuel ?? asString(specs.combustible),
      torque: specs.torque,
      seats: specs.seats ?? asNumber(specs.plazas),
      warranty: specs.warranty ?? asString(specs.garantia),
      gallery: specs.gallery,
      variants: specs.variants,
      colors: specs.colors,
    },
  };
}

const colorSchema = z.object({
  name: z.string().trim().min(1, "Escribe el nombre del color"),
  hex: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Usa un hexadecimal de 6 dígitos, ej. #0D0E10"),
});

const imageSource = (value: string) =>
  /^\/.+/.test(value) || /^https?:\/\/.+/.test(value);

export const vehicleSchema = z.object({
  name: z.string().trim().min(2, "Escribe el nombre del modelo").max(80),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Solo minúsculas, números y guiones (ej. kestrel-400)",
    ),
  category: z.enum(VEHICLE_CATEGORIES, {
    message: "Selecciona una categoría",
  }),
  price: z
    .number({ message: "Escribe un precio de lista." })
    .min(0, "El precio no puede ser negativo")
    .max(100_000_000, "El precio supera el máximo permitido"),
  image_url: z
    .string()
    .trim()
    .min(1, "Agrega la imagen principal")
    .refine(imageSource, "Usa una ruta (/vehicles/...) o una URL http(s)"),
  specs: z.object({
    engine: z.string().trim().min(1, "Escribe el engine"),
    power: z.string().trim().min(1, "Escribe la power"),
    transmission: z.string().trim().min(1, "Escribe la transmisión"),
    drivetrain: z.string().trim().min(1, "Escribe la tracción"),
    fuel: z.string().trim().optional(),
    torque: z.string().trim().optional(),
    seats: z.coerce.number().int().min(1).max(12).optional(),
    warranty: z.string().trim().optional(),
    gallery: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .refine(imageSource, "Usa una ruta (/vehicles/...) o una URL http(s)"),
      )
      .optional(),
    variants: z.array(z.string().trim().min(1)).optional(),
    colors: z.array(colorSchema).optional(),
  }),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export function specRows(specs: VehicleSpecs): { label: string; value: string }[] {
  const rows: Array<[string, string | number | undefined]> = [
    ["Motor", specs.engine],
    ["Potencia", specs.power],
    ["Transmisión", specs.transmission],
    ["Tracción", specs.drivetrain],
    ["Combustible", specs.fuel],
    ["Torque", specs.torque],
    ["Plazas", specs.seats],
    ["Garantía", specs.warranty],
  ];

  return rows
    .filter((row): row is [string, string | number] => Boolean(row[1]))
    .map(([label, value]) => ({ label, value: String(value) }));
}

export function vehicleGallery(vehicle: Vehicle): string[] {
  return Array.from(new Set([vehicle.image_url, ...(vehicle.specs.gallery ?? [])]));
}

export function categoryCounts(vehicles: Vehicle[]): Record<string, number> {
  return vehicles.reduce<Record<string, number>>((counts, vehicle) => {
    counts[vehicle.category] = (counts[vehicle.category] ?? 0) + 1;
    return counts;
  }, {});
}
