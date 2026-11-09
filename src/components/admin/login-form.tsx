"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth-provider";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const { ready, session, signIn } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && session) router.replace("/admin/dashboard");
  }, [ready, session, router]);

  if (!ready || session) {
    return (
      <div
        className="flex min-h-svh items-center justify-center bg-background"
        role="status"
        aria-label="Verificando sesión"
      >
        <Loader2 className="size-6 animate-spin text-signal-ink" aria-hidden="true" />
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = signIn(email, password);

    if (!result.ok) {
      setError(result.error);
      setPassword("");
      document.getElementById("admin-password")?.focus();
      return;
    }

    setError(null);
    router.replace("/admin/dashboard");
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="hidden bg-ink px-10 py-12 text-chalk lg:flex lg:flex-col lg:justify-between">
        <Link href="/" aria-label="AutoNova, ir al sitio">
          <Logo className="text-chalk" />
        </Link>

        <div>
          <p className="display-title max-w-md text-6xl xl:text-7xl">
            Panel de control.
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-chalk/70">
            Administra modelos, precios, imágenes y especificaciones del
            catálogo de AutoNova.
          </p>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-label text-chalk/60">
          AutoNova · Monterrey, N.L.
        </p>
      </aside>

      <main className="flex items-center justify-center bg-chalk px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Link href="/" aria-label="AutoNova, ir al sitio">
              <Logo />
            </Link>
          </div>

          <h1 className="mt-8 font-display text-4xl uppercase leading-none lg:mt-0">
            Acceso al panel
          </h1>
          <p className="mt-2 text-sm text-steel">
            Ingresa con tu cuenta de administrador.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="admin-email">Correo</Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                spellCheck={false}
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                }}
                placeholder="tu@correo.mx"
                className="mt-1.5 h-10"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "admin-login-error" : undefined}
              />
            </div>

            <div>
              <Label htmlFor="admin-password">Contraseña</Label>
              <div className="relative mt-1.5">
                <Input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError(null);
                  }}
                  className="h-10 pr-10"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "admin-login-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-0 top-0 grid size-10 place-items-center text-steel transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p
                id="admin-login-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full">
              Entrar
            </Button>
          </form>

          <Link
            href="/"
            className="mt-6 inline-flex items-center text-sm text-steel transition-colors hover:text-foreground"
          >
            Volver al sitio
          </Link>
        </div>
      </main>
    </div>
  );
}
