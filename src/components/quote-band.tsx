import { WhatsAppButton } from "@/components/whatsapp-button";

export function QuoteBand() {
  return (
    <section className="bg-signal text-ink">
      <div className="shell flex flex-col gap-8 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-16">
        <div>
          <h2 className="display-title max-w-2xl text-4xl sm:text-5xl">
            Tu cotización, sin vueltas.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/80">
            Elige el modelo y escríbenos por WhatsApp. Te responde una persona
            del equipo, no un formulario.
          </p>
        </div>
        <WhatsAppButton
          message="Hola, quiero cotizar un modelo de AutoNova."
          size="lg"
          className="bg-ink text-chalk hover:bg-graphite"
        >
          Cotizar ahora
        </WhatsAppButton>
      </div>
    </section>
  );
}
