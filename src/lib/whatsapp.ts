const FALLBACK_NUMBER = "5215500000000";

export function whatsappUrl(message: string): string {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? FALLBACK_NUMBER)
    .replace(/\D/g, "")
    .trim();

  return `https://wa.me/${number || FALLBACK_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function quoteMessage(
  model: string,
  options?: { variant?: string; color?: string },
): string {
  const details = [options?.variant, options?.color].filter(Boolean);
  const suffix = details.length > 0 ? ` (${details.join(", ")})` : "";

  return `Hola, quiero cotizar ${model}${suffix}.`;
}
