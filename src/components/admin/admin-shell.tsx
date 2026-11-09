"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Car,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth-provider";
import { Logo } from "@/components/logo";
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

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Vehículos", icon: Car },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/admin/dashboard"
    ? pathname === href
    : pathname.startsWith(href);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useAdminAuth();

  function handleSignOut() {
    signOut();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-ink/10 bg-chalk">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6">
            <Link
              href="/admin/dashboard"
              aria-label="AutoNova, ir al dashboard"
              className="shrink-0"
            >
              <Logo />
            </Link>

            <nav
              aria-label="Navegación de administración"
              className="hidden items-center gap-6 lg:flex"
            >
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex items-center gap-2 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-steel hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
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
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-steel transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              Ver sitio
            </Link>
            <span
              className="max-w-[180px] truncate font-mono text-[11px] text-steel"
              title={session?.email}
            >
              {session?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="size-4" aria-hidden="true" />
              Cerrar sesión
            </Button>
          </div>

          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Abrir menú de administración"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[85vw] max-w-sm overscroll-contain bg-chalk p-6">
                <SheetHeader className="p-0">
                  <SheetTitle className="sr-only">Menú de administración</SheetTitle>
                  <SheetDescription className="sr-only">
                    Accesos del panel y cierre de sesión.
                  </SheetDescription>
                  <Logo />
                </SheetHeader>

                <nav
                  aria-label="Navegación móvil de administración"
                  className="mt-8 flex flex-col"
                >
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={
                          isActive(pathname, item.href) ? "page" : undefined
                        }
                        className={cn(
                          "flex items-center gap-3 border-b border-ink/10 py-4 font-display text-2xl uppercase tracking-wide",
                          isActive(pathname, item.href)
                            ? "text-signal-ink"
                            : "text-ink",
                        )}
                      >
                        <item.icon className="size-5" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <p className="mt-6 truncate font-mono text-[11px] text-steel">
                  {session?.email}
                </p>

                <SheetClose asChild>
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-steel transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    Ver sitio
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-6 flex w-full items-center justify-center gap-2 border border-ink/15 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Cerrar sesión
                  </button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
