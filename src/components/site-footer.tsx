import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/logo";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { VEHICLE_CATEGORIES } from "@/lib/vehicles";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-chalk">
      <div className="shell grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:py-20">
        <div>
          <Link href="/" aria-label="AutoNova, inicio" className="inline-block">
            <Logo className="text-chalk" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-chalk/60">
            Agencia automotriz en Monterrey. Modelos seleccionados, entrega
            inmediata y cotización directa por WhatsApp.
          </p>
          <WhatsAppButton
            message="Hola, quiero cotizar un modelo de AutoNova."
            size="lg"
            className="mt-7"
          >
            Cotizar por WhatsApp
          </WhatsAppButton>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="telemetry-label text-chalk/65">Catálogo</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/models" className="text-chalk/80 transition-colors hover:text-chalk">
                  Todos los modelos
                </Link>
              </li>
              {VEHICLE_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/models?category=${encodeURIComponent(category)}`}
                    className="text-chalk/80 transition-colors hover:text-chalk"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="telemetry-label text-chalk/65">Agencia</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/nosotros" className="text-chalk/80 transition-colors hover:text-chalk">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-chalk/80 transition-colors hover:text-chalk">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <h2 className="telemetry-label text-chalk/65">Showroom</h2>
          <ul className="mt-4 space-y-3 text-sm text-chalk/80">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" />
              Av. Constitución 1200, Centro
              <br />
              Monterrey, N.L.
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" />
              <a href="tel:+528180000000" className="transition-colors hover:text-chalk">
                +52 81 8000 0000
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" />
              <a href="mailto:hola@autonova.mx" className="transition-colors hover:text-chalk">
                hola@autonova.mx
              </a>
            </li>
          </ul>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-label text-chalk/65">
            Lun–Sáb · 9:00–19:00
          </p>
        </div>
      </div>

      <div className="border-t border-chalk/10">
        <div className="shell flex flex-col gap-3 py-6 text-[11px] text-chalk/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AutoNova.</p>
          <p className="font-mono uppercase tracking-label">
            Cotización directa por WhatsApp · Monterrey, N.L.
          </p>
        </div>
      </div>
    </footer>
  );
}
