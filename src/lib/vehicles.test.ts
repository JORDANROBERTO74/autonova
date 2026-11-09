import { describe, expect, it } from "vitest";

import {
  categoryCounts,
  specRows,
  vehicleGallery,
  vehicleSchema,
  type Vehicle,
} from "./vehicles";

const validInput = {
  name: "Kestrel 400",
  slug: "kestrel-400",
  category: "SUV",
  price: 689900,
  image_url: "/vehicles/q7.jpg",
  specs: {
    motor: "2.0 L turbo",
    potencia: "245 hp",
    transmision: "Automática 8 vel.",
    traccion: "AWD",
    gallery: ["/vehicles/rav4.jpg"],
    colors: [{ name: "Negro Ónix", hex: "#0D0E10" }],
  },
};

const kestrel: Vehicle = {
  id: "kestrel",
  name: "Kestrel 400",
  slug: "kestrel-400",
  category: "SUV",
  price: 689900,
  image_url: "/vehicles/q7.jpg",
  specs: {
    motor: "2.0 L turbo",
    potencia: "245 hp",
    transmision: "Automática 8 vel.",
    traccion: "AWD",
    gallery: ["/vehicles/rav4.jpg"],
  },
};

describe("vehicleSchema", () => {
  it("acepta un vehículo válido", () => {
    expect(vehicleSchema.safeParse(validInput).success).toBe(true);
  });

  it("rechaza precio vacío y imágenes inválidas", () => {
    expect(vehicleSchema.safeParse({ ...validInput, price: "" }).success).toBe(false);
    expect(vehicleSchema.safeParse({ ...validInput, image_url: "/" }).success).toBe(false);
    expect(
      vehicleSchema.safeParse({
        ...validInput,
        specs: { ...validInput.specs, gallery: ["javascript:alert(1)"] },
      }).success,
    ).toBe(false);
  });
});

describe("specRows", () => {
  it("omite especificaciones opcionales ausentes", () => {
    expect(specRows(kestrel.specs)).toHaveLength(4);
  });

  it("incluye las opcionales presentes", () => {
    const rows = specRows({
      ...kestrel.specs,
      combustible: "Gasolina",
      plazas: 5,
    });

    expect(rows).toContainEqual({ label: "Combustible", value: "Gasolina" });
    expect(rows).toContainEqual({ label: "Plazas", value: "5" });
  });
});

describe("helpers de catálogo", () => {
  it("deduplica la galería e incluye la imagen principal", () => {
    expect(vehicleGallery(kestrel)).toEqual([
      "/vehicles/q7.jpg",
      "/vehicles/rav4.jpg",
    ]);
  });

  it("cuenta modelos por categoría", () => {
    const pickup: Vehicle = {
      ...kestrel,
      id: "ridge",
      slug: "ridge-1500",
      category: "Pickup",
    };

    expect(categoryCounts([kestrel, pickup])).toEqual({ SUV: 1, Pickup: 1 });
  });
});
