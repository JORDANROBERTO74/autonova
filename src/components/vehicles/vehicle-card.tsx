import Link from "next/link";

import { VehicleImage } from "@/components/vehicles/vehicle-image";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/lib/vehicles";
import { formatPrice } from "@/lib/utils";
import { quoteMessage } from "@/lib/whatsapp";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const quickSpecs = [
    ["Motor", vehicle.specs.engine],
    ["Potencia", vehicle.specs.power],
    ["Transmisión", vehicle.specs.transmission],
  ];

  return (
    <article className="group flex flex-col border-t-2 border-ink/10 bg-card transition-colors duration-300 hover:border-signal">
      <Link
        href={`/models/${vehicle.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-ink"
        aria-label={`Ver detalle de ${vehicle.name}`}
      >
        <VehicleImage
          src={vehicle.image_url}
          alt={`${vehicle.name} en exhibición`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 bg-ink/90 px-2 py-1 font-mono text-[11px] uppercase tracking-label text-chalk">
          {vehicle.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl uppercase leading-none">
            <Link href={`/models/${vehicle.slug}`} className="transition-colors hover:text-signal-ink">
              {vehicle.name}
            </Link>
          </h3>
          <p className="shrink-0 font-mono text-sm tabular-nums text-foreground">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        <dl className="mt-4 grid grid-cols-3 divide-x divide-ink/10 border-y border-ink/10 py-3">
          {quickSpecs.map(([label, value]) => (
            <div key={label} className="px-2 first:pl-0 last:pr-0">
              <dt className="telemetry-label">{label}</dt>
              <dd className="mt-1 text-[11px] font-medium leading-snug">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex gap-2 pt-5">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/models/${vehicle.slug}`}>Ver detalle</Link>
          </Button>
          <WhatsAppButton
            message={quoteMessage(vehicle.name)}
            className="flex-1"
            showIcon
          >
            Cotizar
          </WhatsAppButton>
        </div>
      </div>
    </article>
  );
}
