import { describe, expect, it } from "vitest";

import {
  categoryCounts,
  normalizeVehicle,
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
    engine: "2.0 L turbo",
    power: "245 hp",
    transmission: "Automática 8 vel.",
    drivetrain: "AWD",
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
    engine: "2.0 L turbo",
    power: "245 hp",
    transmission: "Automática 8 vel.",
    drivetrain: "AWD",
    gallery: ["/vehicles/rav4.jpg"],
  },
};

describe("vehicleSchema", () => {
  it("accepts a valid vehicle", () => {
    expect(vehicleSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects an empty price and invalid images", () => {
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
  it("omits missing optional specs", () => {
    expect(specRows(kestrel.specs)).toHaveLength(4);
  });

  it("includes optional specs when present", () => {
    const rows = specRows({
      ...kestrel.specs,
      fuel: "Gasolina",
      seats: 5,
    });

    expect(rows).toContainEqual({ label: "Combustible", value: "Gasolina" });
    expect(rows).toContainEqual({ label: "Plazas", value: "5" });
  });
});

describe("catalog helpers", () => {
  it("deduplicates the gallery and includes the main image", () => {
    expect(vehicleGallery(kestrel)).toEqual([
      "/vehicles/q7.jpg",
      "/vehicles/rav4.jpg",
    ]);
  });

  it("counts models by category", () => {
    const pickup: Vehicle = {
      ...kestrel,
      id: "ridge",
      slug: "ridge-1500",
      category: "Pickup",
    };

    expect(categoryCounts([kestrel, pickup])).toEqual({ SUV: 1, Pickup: 1 });
  });

  it("migrates legacy Spanish spec keys", () => {
    const legacy = {
      ...kestrel,
      specs: {
        motor: "2.0 L",
        potencia: "245 hp",
        transmision: "Automática",
        traccion: "AWD",
        combustible: "Gasolina",
        plazas: 5,
        garantia: "5 años",
      },
    } as unknown as Vehicle;

    expect(normalizeVehicle(legacy).specs).toMatchObject({
      engine: "2.0 L",
      power: "245 hp",
      transmission: "Automática",
      drivetrain: "AWD",
      fuel: "Gasolina",
      seats: 5,
      warranty: "5 años",
    });
  });
});
