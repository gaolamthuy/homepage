# AGENTS.md - Project Guide for AI Agents

## Project Overview

- **Framework:** Astro v6 (static site generation, `output: 'static'`)
- **UI:** DaisyUI v5 + Tailwind CSS v4
- **React Islands:** 2 components (ProductDetailIsland, ProductsFilterIsland)
- **Data Source:** Supabase (migrated from CDN JSON)
- **Hosting:** Cloudflare Pages
- **Region:** ap-southeast-1

## Data Architecture

- Data lives in Supabase (`wvckxasjbydyvqgwgdhg.supabase.co`)
- Astro fetches from 3 views at build time (SSG):
  - `v_homepage_products` — products with nested images, pricebooks, child_products
  - `v_homepage_categories` — active categories
  - `v_homepage_album` — price table images
- Windmill syncs data from KiotViet → Supabase, then triggers Cloudflare rebuild
- Client browser NEVER connects to Supabase (static HTML only)

## Key Files

| File | Purpose |
|---|---|
| `src/lib/api.ts` | Data layer — fetches from Supabase views, transforms to Product type |
| `src/lib/supabase.ts` | Supabase client (anon key, build-time only) |
| `src/lib/shared-images.ts` | **TODO** — CDN JSON fallback images, still used by ProductDetailIsland |
| `src/types/product.ts` | TypeScript types for Product, AlbumItem |
| `src/components/ProductDetailIsland.tsx` | React island — product detail with variant selector |

## TODO

### [MIGRATE] Replace shared-images.ts with Supabase images
- **File:** `src/lib/shared-images.ts`
- **Used by:** `src/components/ProductDetailIsland.tsx` (line 3, `getFallbackImages`)
- **What:** Currently fetches fallback images from CDN JSON (`products_shared_image.json`). Should use `glt_product_images` from Supabase instead, or remove entirely if product images are sufficient.
- **Priority:** Low

### [INFRA] Setup Windmill trigger for rebuild
- **What:** When Supabase data changes (KiotViet webhook → Windmill sync), Windmill should call Cloudflare Pages build hook to trigger Astro rebuild.
- **Steps:** Cloudflare Dashboard → project → Settings → Builds → Create deploy hook → add URL to Windmill flow
- **Priority:** High

### [CLEANUP] Remove PUBLIC_API_URL from .env.local
- **What:** No longer needed after CDN JSON → Supabase migration. Already removed from Cloudflare env vars.
- **Priority:** Low

## Build & Deploy

```bash
pnpm build    # Build static site
pnpm dev      # Dev server
```

## Conventions

- DaisyUI classes used extensively (~400+ instances across 10 files) — do NOT migrate to shadcn/ui (Astro incompatible)
- Product type has nested `child_unit` (derived from first child product in api.ts transform)
- Pricebooks structure: `{utdao: {price: number}, whole: {price: number}, ...}`
