import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { QuoteBand } from "@/components/quote-band";
import { VehicleImage } from "@/components/vehicles/vehicle-image";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Visita el showroom de AutoNova en Monterrey o cotiza directamente por WhatsApp.",
};

export default function ContactPage() {
  return (
    <>
      <section className="shell py-14 lg:py-20">
        <h1 className="display-title max-w-3xl text-6xl sm:text-7xl">
          Ven a verlos en persona.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-steel">
          Si prefieres no dar vueltas, escríbenos por WhatsApp y te enviamos
          fotos, disponibilidad y precio de la unidad que te interesa.
        </p>

        <div className="mt-12 grid gap-10 border-t border-ink/10 pt-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <dl className="divide-y divide-ink/10 border-y border-ink/10">
              {[
                {
                  icon: MapPin,
                  label: "Showroom",
                  value: "Av. Constitución 1200, Centro\nMonterrey, Nuevo León",
                },
                {
                  icon: Clock,
                  label: "Horario",
                  value: "Lunes a sábado · 9:00 a 19:00\nDomingo cerrado",
                },
                {
                  icon: Phone,
                  label: "Teléfono",
                  value: "+52 81 8000 0000",
                },
                {
                  icon: Mail,
                  label: "Correo",
                  value: "hola@autonova.mx",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 py-5">
                  <item.icon
                    className="mt-0.5 size-4 shrink-0 text-signal-ink"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="telemetry-label">{item.label}</dt>
                    <dd className="mt-1 whitespace-pre-line text-sm font-medium">
                      {item.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <WhatsAppButton
                message="Hola, quiero cotizar un modelo de AutoNova."
                size="lg"
              >
                Cotizar por WhatsApp
              </WhatsAppButton>
              <a
                href="https://maps.google.com/?q=Av.+Constituci%C3%B3n+1200+Centro+Monterrey"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-ink/30 pb-1 text-sm font-medium transition-colors hover:border-signal-ink hover:text-signal-ink"
              >
                Cómo llegar
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-ink lg:aspect-[4/5]">
            <VehicleImage
              src="/vehicles/range-rover.jpg"
              alt="SUV en exhibición en el showroom de AutoNova"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-6">
              <p className="font-mono text-[11px] uppercase tracking-label text-chalk/60">
                Showroom AutoNova
              </p>
              <p className="mt-1 font-display text-2xl uppercase text-chalk">
                Monterrey, N.L.
              </p>
            </div>
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
