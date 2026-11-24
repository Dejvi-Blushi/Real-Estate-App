# AGENTS.md

Albanian real-estate listings site (T&T Group). Next.js 16 App Router + React 19, Tailwind v4, Clerk auth, Supabase (Postgres + storage), Leaflet/MapTiler maps, Resend for contact email.

## Commands

- `npm install` (npm only; `package-lock.json` is the lockfile), then `npm run dev` → http://localhost:3000
- `npx tsc --noEmit` — typecheck. There is no `typecheck` script. This is currently clean.
- `npm run lint` — ESLint 9 flat config (`eslint`, no args). **Baseline currently fails**: 1 error in `components/ui/carousel.tsx` (`react-hooks/set-state-in-effect`) plus 6 `exhaustive-deps` warnings. Treat these as pre-existing; don't "fix" generated shadcn code unless asked.
- Focused lint: `npx eslint <path>`
- `npm run build` — production build (also typechecks).
- There is no test suite, formatter, or CI. Don't invent one.

## Next.js 16 quirks

- Middleware is root-level `proxy.ts`, not `middleware.ts`. It uses `clerkMiddleware`; add any new auth-gated routes to `isProtectedRoute` there (`/add-listing`, `/edit-listing`, `/my-listings` are protected).
- `searchParams` and `params` are Promises in pages — `await` them (see `app/(routes)/for-sale/page.tsx`).
- `next.config.ts` enables `reactCompiler: true`. Existing data-fetching effects trip `react-hooks/set-state-in-effect`; local style is an `eslint-disable-next-line` comment (see `app/(routes)/my-listings/MyListings.tsx`), not a refactor.
- Only the Supabase project in `next.config.ts` `images.remotePatterns` (`cwqiyobbcouqyivxraxp.supabase.co`, `/storage/v1/object/public/**`) is allowed for `next/image`. Update it if the Supabase project changes.
- Route groups: `app/(routes)/...` and `app/(auth)/...` do not appear in URLs; `app/_components` is not a route.

## Data access (important)

- Three Supabase entrypoints, all authorized by the Clerk session JWT (RLS depends on it). Never construct a bare `createClient`/anon-key client.
  - Server: `createSupabaseServerClient()` from `lib/supabase/server.ts` (`await` it; no Supabase auth cookies — Clerk owns auth). `/for-rent` fetches this way and streams its results under `<Suspense>` in `app/(routes)/for-rent/page.tsx`.
  - Browser: `useSupabaseClient()` from `lib/supabase/client.ts` (hooks-based). Still used by forms, `my-listings`, `view-listing`, and `for-sale`.
- The only non-Supabase server code is `app/actions/contact.ts` (`"use server"`, Resend). Keep `RESEND_API_KEY` and `CONTACT_EMAIL` usage server-side.
- Supabase objects used in code:
  - `listings` — columns include `title`, `description`, `price`, `area_size`, `bedrooms`, `bathrooms`, `address`, `city`, `listing_type`, `property_type`, `latitude`, **`longtitude`** (misspelled in DB; use this exact name), `user_id` (Clerk user id), `contact_info`, `created_at`.
  - `listing_images` — `listing_id`, `path`, `position`. `position = 0` is the cover image; list queries filter `.eq("listing_images.position", 0)`.
  - Storage bucket `listing-images`; upload path convention `${listingId}/${listingId}-${Date.now()}-${randomId()}` (`utils/randomNumericId.ts`). DB stores the path; public URLs are built with `supabase.storage.from("listing-images").getPublicUrl(path)`.
- `listing_type` values are `"rent"` and `"sell"` (not `"sale"`/`"for-sale"`), even though routes are `/for-rent` and `/for-sale`.

## Types & conventions

- `types/types.d.ts` (ambient-only module — import with `import type`) defines `FormData`, which shadows the DOM `FormData` — it is the DB row (`id`, ..., `longtitude`, `user_id`). `FullFormData` adds `images: File[]`. `ListingFetchedData` requires `listing_images: { path }[]` (paths become public URLs after fetch).
- Path alias `@/*` maps to the repo root (there is no `src/`).
- Branded UI primitives in `components/ui` are shadcn-generated using the **unified `radix-ui` package** (`import { Select } from "radix-ui"`), not `@radix-ui/react-*`. Config: `components.json` (style `radix-vega`, lucide icons, `app/globals.css`); Tailwind v4 is CSS-first — no `tailwind.config`, theme tokens live in `app/globals.css`.
- Feature folders: `components/{cards,forms,filtering,maps,ui}`, `app/_components` for header/footer/nav, `lib/data` for static options (`cities.ts`, `propertyTypes.ts`, `maxListingsPerPage.ts` — add new cities/types there; they feed both the form and `FilterBar`).
- Filter/pagination state lives entirely in URL search params (`page`, `propertyType`, `city`, `bedrooms`, `bathrooms`); `FilterBar` and `Pagination` push new URLs.
- Leaflet (`react-leaflet` + `@maptiler/leaflet-maptilersdk`) must be client-only: load it via `dynamic(..., { ssr: false })`. `ssr: false` is disallowed in Server Components, so server-rendered pages must use the client wrapper `components/maps/MapListingsClient.tsx`. Runtime Leaflet is imported inside effects. Leaflet types are used as the global `L.LatLng` without an import.

## Setup

- Copy `.env.example` → `.env.local`; all values are required: Clerk publishable/secret keys, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_MAPTILER_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`. `.env*` (except `.env.example`) is gitignored.
- `README.md` is the untouched create-next-app boilerplate; trust config and code over it.
