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
  motor: string;
  potencia: string;
  transmision: string;
  traccion: string;
  combustible?: string;
  torque?: string;
  plazas?: number;
  garantia?: string;
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
    motor: z.string().trim().min(1, "Escribe el motor"),
    potencia: z.string().trim().min(1, "Escribe la potencia"),
    transmision: z.string().trim().min(1, "Escribe la transmisión"),
    traccion: z.string().trim().min(1, "Escribe la tracción"),
    combustible: z.string().trim().optional(),
    torque: z.string().trim().optional(),
    plazas: z.coerce.number().int().min(1).max(12).optional(),
    garantia: z.string().trim().optional(),
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
    ["Motor", specs.motor],
    ["Potencia", specs.potencia],
    ["Transmisión", specs.transmision],
    ["Tracción", specs.traccion],
    ["Combustible", specs.combustible],
    ["Torque", specs.torque],
    ["Plazas", specs.plazas],
    ["Garantía", specs.garantia],
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
