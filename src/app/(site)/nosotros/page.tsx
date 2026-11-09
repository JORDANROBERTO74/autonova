import type { Metadata } from "next";

import { QuoteBand } from "@/components/quote-band";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "AutoNova es una agencia automotriz en Monterrey con seis marcas representadas y cotización directa por WhatsApp.",
};

const yearsInOperation = new Date().getFullYear() - 2013;

const stats = [
  [String(yearsInOperation), "Años en operación"],
  ["1,800+", "Entregas"],
  ["06", "Marcas representadas"],
  ["48 h", "Entrega estimada"],
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="shell py-14 lg:py-20">
        <h1 className="display-title max-w-4xl text-6xl sm:text-7xl lg:text-8xl">
          Vendemos autos, no laberintos.
        </h1>

        <div className="mt-12 grid gap-10 border-t border-ink/10 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="space-y-5 text-sm leading-relaxed text-steel">
            <p className="text-base text-foreground">
              AutoNova nació en 2013 con una idea simple: que comprar un auto no
              dependa de descifrar letras chiquitas.
            </p>
            <p>
              Trabajamos con seis marcas y un inventario corto a propósito.
              Preferimos conocer cada unidad que tenemos en piso antes que
              llenar el lote de modelos que nadie puede explicar.
            </p>
            <p>
              Cada precio publicado es el precio de lista. La cotización final,
              el financiamiento y la entrega se cierran por WhatsApp con una
              persona del equipo, no con un formulario.
            </p>
          </div>

          <dl className="grid grid-cols-2 divide-x divide-y divide-ink/10 border-y border-ink/10">
            {stats.map(([value, label]) => (
              <div key={label} className="p-6">
                <dd className="font-display text-5xl uppercase leading-none">{value}</dd>
                <dt className="mt-2 font-mono text-[11px] uppercase tracking-label text-steel">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 grid gap-8 border-t border-ink/10 pt-10 md:grid-cols-3">
          {[
            {
              title: "Precio claro",
              body: "El número que ves es el precio de lista. Sin cargos sorpresa ni condicionantes.",
            },
            {
              title: "Entrega real",
              body: "Unidades en piso con entrega estimada de 48 horas en el área metropolitana de Monterrey.",
            },
            {
              title: "Respaldo directo",
              body: "Garantía de fábrica y un asesor asignado por WhatsApp durante todo el proceso.",
            },
          ].map((item) => (
            <div key={item.title} className="border-t-2 border-ink pt-5">
              <h2 className="font-display text-2xl uppercase">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
