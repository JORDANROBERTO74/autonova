import { describe, expect, it } from "vitest";

import { quoteMessage, whatsappUrl } from "./whatsapp";

describe("quoteMessage", () => {
  it("arma el mensaje base sin opciones", () => {
    expect(quoteMessage("Kestrel 400")).toBe("Hola, quiero cotizar Kestrel 400.");
  });

  it("agrega variante y color cuando existen", () => {
    expect(
      quoteMessage("Kestrel 400", { variant: "Sport", color: "Negro Ónix" }),
    ).toBe("Hola, quiero cotizar Kestrel 400 (Sport, Negro Ónix).");
  });
});

describe("whatsappUrl", () => {
  it("normaliza el número y codifica el mensaje", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "+52 81 1234 5678";
    const url = whatsappUrl(quoteMessage("Kestrel 400"));

    expect(url.startsWith("https://wa.me/528112345678?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("Hola, quiero cotizar Kestrel 400."));
    expect(url).not.toContain(" ");
  });
});
