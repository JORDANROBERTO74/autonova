import Link from "next/link";

import { QuoteBand } from "@/components/quote-band";
import { Button } from "@/components/ui/button";
import { CategorySection } from "@/components/vehicles/category-section";
import { FeaturedVehicles } from "@/components/vehicles/featured-vehicles";
import { WhatsAppButton } from "@/components/whatsapp-button";

const heroStats = [
  ["06", "Marcas representadas"],
  ["05", "Categorías"],
  ["48 h", "Entrega estimada"],
  ["8 años", "Garantía de batería"],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-chalk">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vehicles/q7.jpg"
            alt=""
            width={1600}
            height={1100}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/25" />
        </div>

        <div className="shell flex min-h-[74svh] flex-col justify-center py-20 lg:min-h-[78svh]">
          <h1 className="display-title max-w-4xl text-6xl sm:text-7xl lg:text-8xl">
            El siguiente modelo ya está en piso.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-chalk/70">
            SUVs, pickups, sedanes y eléctricos con precio de lista claro.
            Elige el tuyo y cotiza por WhatsApp en menos de un minuto.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-7">
              <Link href="/models">Ver modelos</Link>
            </Button>
            <WhatsAppButton
              message="Hola, quiero cotizar un modelo de AutoNova."
              variant="outline"
              size="lg"
              className="h-12 border-chalk/30 bg-transparent px-7 text-chalk hover:border-chalk hover:bg-chalk hover:text-ink"
            >
              Cotizar por WhatsApp
            </WhatsAppButton>
          </div>
        </div>

        <div className="relative border-t border-chalk/15 bg-ink/70">
          <dl className="shell grid grid-cols-2 sm:grid-cols-4">
            {heroStats.map(([value, label], index) => (
              <div
                key={label}
                className={[
                  "py-5",
                  index === 0 ? "pr-4" : "pl-4",
                  index === 1 ? "border-l border-chalk/10" : "",
                  index === 2
                    ? "border-t border-chalk/10 pr-4 sm:border-l sm:border-t-0"
                    : "",
                  index === 3
                    ? "border-l border-t border-chalk/10 pl-4 sm:border-t-0"
                    : "",
                ].join(" ")}
              >
                <dt className="font-mono text-[11px] uppercase tracking-label text-chalk/65">
                  {label}
                </dt>
                <dd className="mt-1 font-mono text-2xl tabular-nums text-chalk">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FeaturedVehicles />
      <CategorySection />
      <QuoteBand />
    </>
  );
}
