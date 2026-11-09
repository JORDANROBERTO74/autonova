"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ImageOff, Save } from "lucide-react";
import { toast } from "sonner";

import { useVehicles } from "@/components/vehicles/vehicles-provider";
import { VehicleImage } from "@/components/vehicles/vehicle-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  VEHICLE_CATEGORIES,
  vehicleSchema,
  type Vehicle,
  type VehicleColor,
} from "@/lib/vehicles";
import { slugify } from "@/lib/utils";

type FormValues = {
  name: string;
  slug: string;
  category: string;
  price: string;
  image_url: string;
  motor: string;
  potencia: string;
  transmision: string;
  traccion: string;
  combustible: string;
  torque: string;
  plazas: string;
  garantia: string;
  gallery: string;
  variants: string;
  colors: string;
};

type FieldErrors = Record<string, string>;

const emptyValues: FormValues = {
  name: "",
  slug: "",
  category: "SUV",
  price: "",
  image_url: "",
  motor: "",
  potencia: "",
  transmision: "",
  traccion: "",
  combustible: "",
  torque: "",
  plazas: "",
  garantia: "",
  gallery: "",
  variants: "",
  colors: "",
};

const specFields = [
  { key: "motor", label: "Motor", placeholder: "2.0 L turbo" },
  { key: "potencia", label: "Potencia", placeholder: "245 hp" },
  { key: "transmision", label: "Transmisión", placeholder: "Automática 8 vel." },
  { key: "traccion", label: "Tracción", placeholder: "AWD" },
  { key: "combustible", label: "Combustible", placeholder: "Gasolina", optional: true },
  { key: "torque", label: "Torque", placeholder: "370 Nm", optional: true },
  { key: "plazas", label: "Plazas", placeholder: "5", type: "number", optional: true },
  { key: "garantia", label: "Garantía", placeholder: "5 años o 100,000 km", optional: true },
] as const;

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseColors(text: string): { colors: VehicleColor[]; error?: string } {
  const colors: VehicleColor[] = [];

  for (const line of linesToArray(text)) {
    const [name, hex] = line.split("|").map((part) => part.trim());
    if (!name || !/^#[0-9a-fA-F]{6}$/.test(hex ?? "")) {
      return {
        colors: [],
        error: "Cada color usa el formato Nombre|#0D0E10 (hex de 6 dígitos).",
      };
    }
    colors.push({ name, hex });
  }

  return { colors };
}

function valuesFromVehicle(vehicle: Vehicle): FormValues {
  return {
    name: vehicle.name,
    slug: vehicle.slug,
    category: vehicle.category,
    price: String(vehicle.price),
    image_url: vehicle.image_url,
    motor: vehicle.specs.motor,
    potencia: vehicle.specs.potencia,
    transmision: vehicle.specs.transmision,
    traccion: vehicle.specs.traccion,
    combustible: vehicle.specs.combustible ?? "",
    torque: vehicle.specs.torque ?? "",
    plazas: vehicle.specs.plazas ? String(vehicle.specs.plazas) : "",
    garantia: vehicle.specs.garantia ?? "",
    gallery: (vehicle.specs.gallery ?? []).join("\n"),
    variants: (vehicle.specs.variants ?? []).join("\n"),
    colors: (vehicle.specs.colors ?? [])
      .map((color) => `${color.name}|${color.hex}`)
      .join("\n"),
  };
}

export function VehicleForm({ vehicleId }: { vehicleId?: string }) {
  const { vehicles, hydrated } = useVehicles();
  const vehicle = vehicleId
    ? vehicles.find((item) => item.id === vehicleId)
    : undefined;

  if (vehicleId && !hydrated) {
    return (
      <div className="shell py-10 lg:py-14" aria-busy="true" aria-label="Cargando modelo">
        <div className="h-4 w-32 animate-pulse bg-muted" />
        <div className="mt-6 h-12 w-64 animate-pulse bg-muted" />
        <div className="mt-8 h-80 animate-pulse bg-muted" />
      </div>
    );
  }

  if (vehicleId && !vehicle) {
    return (
      <div className="shell flex flex-col items-center py-24 text-center">
        <p className="eyebrow">Admin</p>
        <h1 className="display-title mt-3 text-4xl">Modelo no encontrado</h1>
        <p className="mt-3 max-w-sm text-sm text-steel">
          El modelo no existe en este navegador. Vuelve a la lista para elegir
          otro.
        </p>
        <Button asChild className="mt-7">
          <Link href="/admin/vehicles">Volver a vehículos</Link>
        </Button>
      </div>
    );
  }

  return (
    <VehicleFormFields
      key={vehicle?.id ?? "new"}
      vehicle={vehicle}
    />
  );
}

function VehicleFormFields({ vehicle }: { vehicle?: Vehicle }) {
  const router = useRouter();
  const { createVehicle, updateVehicle } = useVehicles();
  const [values, setValues] = useState<FormValues>(() =>
    vehicle ? valuesFromVehicle(vehicle) : emptyValues,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [dirty, setDirty] = useState(false);

  const isEdit = Boolean(vehicle);
  const colorPreview = parseColors(values.colors).colors;

  useEffect(() => {
    if (!dirty) return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function clearError(key: string) {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function updateField(key: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
    clearError(key);
  }

  function focusFirstError(nextErrors: FieldErrors) {
    const firstKey = Object.keys(nextErrors)[0];
    if (!firstKey) return;
    const id = firstKey.replace(/^specs\./, "").split(".")[0];
    requestAnimationFrame(() => document.getElementById(id)?.focus());
  }

  function handleName(value: string) {
    setValues((current) => {
      const syncSlug = current.slug === "" || current.slug === slugify(current.name);
      return {
        ...current,
        name: value,
        slug: syncSlug ? slugify(value) : current.slug,
      };
    });
    setDirty(true);
    clearError("name");
    clearError("slug");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedColors = parseColors(values.colors);
    if (parsedColors.error) {
      const nextErrors = { colors: parsedColors.error };
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      toast.error("Revisa los colores.");
      return;
    }

    const result = vehicleSchema.safeParse({
      name: values.name,
      slug: values.slug || slugify(values.name),
      category: values.category,
      price: values.price.trim() === "" ? undefined : Number(values.price),
      image_url: values.image_url,
      specs: {
        motor: values.motor,
        potencia: values.potencia,
        transmision: values.transmision,
        traccion: values.traccion,
        combustible: values.combustible || undefined,
        torque: values.torque || undefined,
        plazas: values.plazas ? Number(values.plazas) : undefined,
        garantia: values.garantia || undefined,
        gallery: linesToArray(values.gallery),
        variants: linesToArray(values.variants),
        colors: parsedColors.colors,
      },
    });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".").replace(/\.\d+(?:\..*)?$/, "");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      toast.error("Revisa los campos marcados.");
      return;
    }

    const mutation = vehicle
      ? updateVehicle(vehicle.id, result.data)
      : createVehicle(result.data);

    if (!mutation.ok) {
      setErrors({ slug: mutation.error });
      focusFirstError({ slug: mutation.error });
      return;
    }

    setDirty(false);
    toast.success(vehicle ? "Modelo actualizado." : "Modelo creado.");
    router.push("/admin/vehicles");
  }

  return (
    <div className="shell py-10 lg:py-14">
      <Link
        href="/admin/vehicles"
        className="inline-flex items-center gap-2 text-sm text-steel transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Vehículos
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-title text-4xl sm:text-5xl">
            {isEdit && vehicle ? vehicle.name : "Agregar al catálogo"}
          </h1>
        </div>
        <p className="max-w-xs text-xs text-steel">
          Los cambios se guardan en este navegador.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate autoComplete="off" className="mt-8 space-y-6">
        <section className="border border-ink/10 bg-card p-5 sm:p-6">
          <h2 className="font-display text-2xl uppercase">Identidad</h2>
          <p className="mt-1 text-xs text-steel">
            Nombre comercial, URL del modelo y categoría.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" htmlFor="name" error={errors.name}>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={(event) => handleName(event.target.value)}
                placeholder="Kestrel 400"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </Field>

            <Field
              label="Slug"
              htmlFor="slug"
              error={errors.slug}
              hint="Se genera desde el nombre. Solo minúsculas y guiones."
            >
              <Input
                id="slug"
                name="slug"
                value={values.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="kestrel-400"
                required
                aria-invalid={Boolean(errors.slug)}
                aria-describedby={errors.slug ? "slug-error" : undefined}
              />
            </Field>

            <Field label="Categoría" htmlFor="category" error={errors.category}>
              <Select
                value={values.category}
                onValueChange={(value) => updateField("category", value)}
              >
                <SelectTrigger
                  id="category"
                  aria-required="true"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? "category-error" : undefined}
                >
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Precio de lista (MXN)" htmlFor="price" error={errors.price}>
              <Input
                id="price"
                name="price"
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                value={values.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="689900"
                required
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? "price-error" : undefined}
              />
            </Field>
          </div>
        </section>

        <section className="border border-ink/10 bg-card p-5 sm:p-6">
          <h2 className="font-display text-2xl uppercase">Imagen principal</h2>
          <p className="mt-1 text-xs text-steel">
            Ruta local (<code className="font-mono">/vehicles/…</code>) o URL
            http(s). Se usa en tarjetas y galería.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
            <Field label="URL de imagen" htmlFor="image_url" error={errors["image_url"]}>
              <Input
                id="image_url"
                name="image_url"
                value={values.image_url}
                onChange={(event) => updateField("image_url", event.target.value)}
                placeholder="/vehicles/q7.jpg"
                required
                aria-invalid={Boolean(errors["image_url"])}
                aria-describedby={
                  errors["image_url"] ? "image_url-error" : undefined
                }
              />
            </Field>

            <div className="relative aspect-[16/9] overflow-hidden border border-ink/10 bg-muted">
              {values.image_url ? (
                <VehicleImage src={values.image_url} alt="Vista previa de la imagen" sizes="320px" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-steel">
                  <ImageOff className="size-6" aria-hidden="true" />
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border border-ink/10 bg-card p-5 sm:p-6">
          <h2 className="font-display text-2xl uppercase">Especificaciones</h2>
          <p className="mt-1 text-xs text-steel">
            Los cuatro primeros campos son obligatorios.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specFields.map((field) => {
              const error = errors[`specs.${field.key}`];
              return (
                <Field
                  key={field.key}
                  label={field.label + ("optional" in field ? " (opcional)" : "")}
                  htmlFor={field.key}
                  error={error}
                >
                  <Input
                    id={field.key}
                    name={field.key}
                    type={"type" in field ? field.type : "text"}
                    min={field.key === "plazas" ? 1 : undefined}
                    value={values[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    required={!("optional" in field)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${field.key}-error` : undefined}
                  />
                </Field>
              );
            })}
          </div>
        </section>

        <section className="border border-ink/10 bg-card p-5 sm:p-6">
          <h2 className="font-display text-2xl uppercase">Galería y opciones</h2>
          <p className="mt-1 text-xs text-steel">
            Una entrada por línea. Las variantes y colores alimentan los
            selectores del detalle.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Field
              label="Galería (URLs)"
              htmlFor="gallery"
              error={errors["specs.gallery"]}
              hint="Una URL por línea."
            >
              <Textarea
                id="gallery"
                name="gallery"
                rows={5}
                value={values.gallery}
                onChange={(event) => updateField("gallery", event.target.value)}
                placeholder={"/vehicles/foto-1.jpg\n/vehicles/foto-2.jpg"}
                aria-invalid={Boolean(errors["specs.gallery"])}
                aria-describedby={errors["specs.gallery"] ? "gallery-error" : undefined}
              />
            </Field>

            <Field
              label="Variantes"
              htmlFor="variants"
              error={errors["specs.variants"]}
              hint="Una variante por línea."
            >
              <Textarea
                id="variants"
                name="variants"
                rows={5}
                value={values.variants}
                onChange={(event) => updateField("variants", event.target.value)}
                placeholder={"Comfort\nSport\nSignature"}
                aria-invalid={Boolean(errors["specs.variants"])}
                aria-describedby={errors["specs.variants"] ? "variants-error" : undefined}
              />
            </Field>

            <Field
              label="Colores"
              htmlFor="colors"
              error={errors.colors ?? errors["specs.colors"]}
              hint="Formato: Nombre|#0D0E10"
            >
              <Textarea
                id="colors"
                name="colors"
                rows={5}
                value={values.colors}
                onChange={(event) => updateField("colors", event.target.value)}
                placeholder={"Negro Ónix|#0D0E10\nBlanco Glacier|#EDEDE8"}
                aria-invalid={Boolean(errors.colors ?? errors["specs.colors"])}
                aria-describedby={
                  errors.colors ?? errors["specs.colors"] ? "colors-error" : undefined
                }
              />
              {colorPreview.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2" aria-hidden="true">
                  {colorPreview.map((color) => (
                    <span
                      key={`${color.name}-${color.hex}`}
                      className="size-4 rounded-full border border-ink/20"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              ) : null}
            </Field>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:justify-end">
          <Button asChild variant="outline">
            <Link href="/admin/vehicles">Cancelar</Link>
          </Button>
          <Button type="submit">
            <Save className="size-4" aria-hidden="true" />
            {isEdit ? "Guardar cambios" : "Crear modelo"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-steel">{hint}</p>
      ) : null}
    </div>
  );
}
