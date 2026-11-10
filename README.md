# AutoNova

Automotive catalog front-end built with Next.js 15: vehicle models, spec sheets, WhatsApp quoting and an admin panel backed by local browser data.

**Portfolio implementation, not production-ready.** It has no backend, payments, real inventory or server authentication.

The product UI and vehicle copy are in Spanish; the engineering surface is in English.

![AutoNova home page with the headline "El siguiente modelo ya está en piso", a white SUV and the featured models](docs/screenshot.webp)

**Live site:** <https://autonova-orcin.vercel.app/>

## What it is

AutoNova covers the full flow of a dealership catalog:

- Home with a hero, featured vehicles and categories.
- Catalog with category filters.
- Detail page with gallery, spec sheet, variants and colors.
- WhatsApp quote with model, variant and color in the message.
- Admin panel with local login, dashboard and vehicle CRUD.

There is no cart or checkout: the conversion ends in a WhatsApp conversation.

## Why this project

- **Quote, not checkout.** The CTA opens WhatsApp with the selected model and configuration. There is no cart to abandon.
- **Full admin without a backend.** Local login, dashboard, CRUD, persistence and catalog restore in `localStorage`.
- **Local responsive images.** Photos at `400/800/1200/1600` with `srcset`; no runtime CDN requests.
- **Minimal stack.** Next.js 15, strict TypeScript, Tailwind and shadcn/ui primitives. No Supabase, no Server Actions.
- **What it is not.** It does not process payments, store data on a server, send email, manage real inventory or provide server authentication. If you need a store with checkout or a multiuser admin, this project is not the base.

## Getting started

Requirements: Node.js 24 (see `.nvmrc`) and pnpm 11. The project declares Node >=20 in `package.json`; verification used Node 24.3 and pnpm 11.17.

```bash
git clone https://github.com/JORDANROBERTO74/autonova.git
cd autonova
pnpm install
pnpm dev
```

Open <http://localhost:3000>. Environment variables are optional for development: the defaults run the catalog and the admin panel.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server on port 3000 |
| `pnpm build` | Create the production build and typecheck |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the Vitest suite |

## Routes

| Route | Description |
| --- | --- |
| `/` | Home with hero, featured vehicles and categories |
| `/models` | Catalog with category filters |
| `/models/[slug]` | Gallery, spec sheet, variants and colors |
| `/nosotros` | About the dealership |
| `/contacto` | Showroom and contact |
| `/admin` | Admin entry; redirects to login or dashboard |
| `/admin/login` | Access with the configured credentials |
| `/admin/dashboard` | Catalog summary |
| `/admin/vehicles` | Vehicle CRUD |
| `/admin/vehicles/new` | Create a model |
| `/admin/vehicles/[id]/edit` | Edit a model |

## Admin panel

- `/admin` is the only entry point. There are no links to the panel on the public site.
- The session lives in `localStorage` (`autonova.admin.session.v1`) and expires after 8 hours.
- Default credentials: `admin@autonova.mx` / `autonova2026`; change them in `.env.local`.
- The dashboard shows total models, categories, average price and inventory value.
- The CRUD allows creating, editing, deleting and restoring the catalog.

**Important:** credentials use `NEXT_PUBLIC_*` and the session is stored in `localStorage`. This is a UI access gate, not real authentication: credentials are visible in the bundle and the session can be created manually. Production needs server authentication with an `httpOnly` cookie.

## Environment variables

Copy [.env.example](.env.example) to `.env.local` if you want to change the defaults:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number, digits only. Defaults to `5215500000000`; change it before publishing. |
| `NEXT_PUBLIC_SITE_URL` | Public origin for metadata. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Admin email. Defaults to `admin@autonova.mx`. |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin password. Defaults to `autonova2026`. |

## Architecture

```text
src/
  app/(site)/              home, catalog, detail, about and contact
  app/admin/               login, dashboard and CRUD
  components/              site, vehicles, admin and ui primitives
  lib/                     data, local auth, WhatsApp and utilities
  lib/mock/vehicles.ts     8 seed vehicles
public/vehicles/           photos and responsive variants
docs/screenshot.webp       screenshot used in this README
```

- `src/components/vehicles/vehicles-provider.tsx`: catalog state on the client; hydrates and persists to `autonova.vehicles.v1`.
- `src/lib/admin-auth.ts`: local 8-hour admin session.
- `src/lib/vehicles.ts`: types, Zod schema, specs and category counts.
- `src/lib/whatsapp.ts`: the only builder for `wa.me` links and quote messages.
- `src/components/admin/vehicle-form.tsx`: create and edit form validated with Zod.

## Status and scope

- Portfolio piece; no CI or releases. Last verification: November 2026.
- Functional front-end implementation; not production-ready.
- Data and prices are fictional.
- No backend, payments, email, real inventory or uploads: images are added by URL.
- The admin panel is local to the browser; no multiuser accounts or shared data.

## Verification

- `pnpm lint` ✅
- `pnpm test` ✅ (14 tests)
- `pnpm build` ✅
- Clean install from the clone: `pnpm install --frozen-lockfile` + `pnpm build` ✅
- Tested on Node 24.3 and pnpm 11.17. Last manual verification: November 2026.

## License

MIT for the code. Photos in `public/vehicles` are from Unsplash and keep their own license. See [LICENSE](LICENSE).
