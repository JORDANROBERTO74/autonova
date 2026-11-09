import type { Metadata, Viewport } from "next";
import { Archivo, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";

import { VehiclesProvider } from "@/components/vehicles/vehicles-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sans = Archivo({
  variable: "--font-sans",
  display: "swap",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const display = Barlow_Condensed({
  variable: "--font-display",
  display: "swap",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "AutoNova · SUVs, pickups y eléctricos en Monterrey",
    template: "%s · AutoNova",
  },
  description:
    "Catálogo automotriz con precio de lista, ficha técnica y cotización directa por WhatsApp. Sin carrito, sin checkout.",
};

export const viewport: Viewport = {
  themeColor: "#F3F2EE",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${sans.variable} ${mono.variable} ${display.variable} min-h-svh antialiased`}
      >
        <VehiclesProvider>
          {children}
          <Toaster position="top-center" />
        </VehiclesProvider>
      </body>
    </html>
  );
}
