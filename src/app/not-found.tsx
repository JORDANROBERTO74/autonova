import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-chalk px-6 text-center">
      <p className="font-mono text-[11px] uppercase tracking-label text-steel">
        Error 404
      </p>
      <h1 className="display-title mt-3 text-6xl">Página no encontrada</h1>
      <p className="mt-4 max-w-md text-sm text-steel">
        La dirección que buscas no existe o el modelo salió del catálogo.
      </p>
      <Link
        href="/models"
        className="mt-8 inline-flex h-11 items-center justify-center bg-signal px-6 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-chalk"
      >
        Ver modelos
      </Link>
    </div>
  );
}
