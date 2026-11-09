# AutoNova

Plataforma automotriz UI-only con Next.js 15 (App Router), TypeScript, Tailwind CSS y shadcn/ui.

Catálogo, detalle de modelos y panel de administración. **No hay carrito ni checkout**: el único CTA de conversión es WhatsApp con mensaje preconfigurado.

## Correr el proyecto

Requiere Node 20+ y pnpm 11+ (`corepack enable`).

```bash
pnpm install
pnpm dev
```

Abre http://localhost:3000.

```bash
pnpm build   # build + typecheck
pnpm lint
pnpm test    # tests unitarios
```

## Variables de entorno

Copia `.env.example` a `.env.local`:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5215512345678
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=admin@autonova.mx
NEXT_PUBLIC_ADMIN_PASSWORD=autonova2026
```

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: formato internacional, solo dígitos. El valor por defecto es un placeholder (`5215500000000`).
- `NEXT_PUBLIC_SITE_URL`: origen público para metadatos.
- `NEXT_PUBLIC_ADMIN_EMAIL` / `NEXT_PUBLIC_ADMIN_PASSWORD`: credenciales del panel. Estos valores son visibles en el bundle del cliente; funcionan como control de acceso local, no como autenticación real.

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Hero, destacados, categorías/marcas y CTA |
| `/models` | Catálogo con filtros por categoría |
| `/models/[slug]` | Galería, ficha técnica, variantes y colores |
| `/nosotros` | Página de agencia |
| `/contacto` | Showroom y contacto |
| `/admin` | Entrada del panel; redirige a login o dashboard |
| `/admin/login` | Acceso con las credenciales configuradas |
| `/admin/dashboard` | Resumen del catálogo |
| `/admin/vehicles` | CRUD de vehículos |
| `/admin/vehicles/new` | Crear modelo |
| `/admin/vehicles/[id]/edit` | Editar modelo |

## Acceso al panel

- La sesión se guarda en `localStorage` (`autonova.admin.session.v1`) y expira a las 8 horas.
- `/admin` es la única entrada pública del panel; no hay enlaces en el sitio.
- Sin sesión, cualquier ruta del panel redirige a `/admin/login`.
- Credenciales por defecto: `admin@autonova.mx` / `autonova2026`, configurables en `.env.local`.
- **Limitación**: al usar `NEXT_PUBLIC_*` y `localStorage`, las credenciales son visibles en el bundle y la sesión se puede crear manualmente. No es autenticación de servidor. Para producción se requiere login real con cookie `httpOnly` o retirar la ruta del build público.

## Arquitectura

- `src/lib/mock/vehicles.ts`: 8 vehículos seed, fuente inicial de datos.
- `src/components/vehicles/vehicles-provider.tsx`: estado global en cliente. Hidrata desde `localStorage` (`autonova.vehicles.v1`), crea, edita, elimina y restaura el seed.
- `src/lib/admin-auth.ts`: sesión local, credenciales y expiración.
- `src/components/admin/admin-auth-provider.tsx`: contexto de sesión, login y logout.
- `src/components/admin/admin-guard.tsx`: protección de las rutas del panel.
- `src/components/admin/admin-shell.tsx`: navegación del panel, sesión y logout.
- `src/lib/vehicles.ts`: tipos, schema Zod, filas de especificaciones y conteos por categoría.
- `src/lib/whatsapp.ts`: único constructor de enlaces `wa.me` y mensajes de cotización.
- `src/components/admin/vehicle-form.tsx`: formulario compartido de alta y edición, validado con Zod.

Los cambios del admin se reflejan al instante en home, catálogo y detalle porque todas las vistas consumen el mismo provider. Se guardan por navegador, no en un servidor.

## Alcance y límites

- Datos locales en `localStorage`; sin Supabase y sin Server Actions.
- Login local de 8 horas; no sustituye autenticación de servidor.
- Sin subida de archivos: las imágenes se agregan por URL.
- Los datos y precios son ficticios.

## Pendientes para producción

1. Reemplazar `NEXT_PUBLIC_WHATSAPP_NUMBER` por el número real.
2. Configurar `NEXT_PUBLIC_SITE_URL` con el dominio público.
3. Implementar autenticación real del panel y retirar las credenciales del bundle.

Las fotos de `public/vehicles` provienen de Unsplash y se usan como material de exhibición. Algunas muestran logotipos de marcas reales; los nombres del catálogo son ficticios y no implican afiliación.
