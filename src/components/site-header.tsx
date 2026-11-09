"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Logo } from "@/components/logo";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/models", label: "Modelos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const quoteHref = whatsappUrl("Hola, quiero cotizar un modelo de AutoNova.");

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-chalk/95 backdrop-blur supports-[backdrop-filter]:bg-chalk/85">
      <div className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link href="/" aria-label="AutoNova, inicio" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-steel",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-0.5 bg-signal transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild size="sm" className="h-9 px-4">
            <a href={quoteHref} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" />
              Cotizar
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="icon-lg" aria-label="Cotizar por WhatsApp">
            <a href={quoteHref} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" />
            </a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[85vw] max-w-sm overscroll-contain bg-chalk p-6">
              <SheetHeader className="p-0">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <SheetDescription className="sr-only">
                  Enlaces principales del sitio AutoNova.
                </SheetDescription>
                <Logo />
              </SheetHeader>
              <nav aria-label="Navegación móvil" className="mt-8 flex flex-col">
                {links.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(pathname, link.href) ? "page" : undefined}
                      className={cn(
                        "border-b border-ink/10 py-4 font-display text-3xl uppercase tracking-wide",
                        isActive(pathname, link.href) ? "text-signal-ink" : "text-ink",
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <Button asChild size="lg" className="mt-8 w-full">
                  <a href={quoteHref} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="size-4" />
                    Cotizar por WhatsApp
                  </a>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
