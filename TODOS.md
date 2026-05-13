# TODOS

Tracking items not yet done after the Cloudflare Workers + TanStack Router setup.

## High leverage (do before first public deploy)

- [ ] **Favicon** — no `<link rel="icon">` in `index.html`. Drop SVG/PNG in `public/`, wire in `index.html`.
- [ ] **OG / Twitter meta tags** — for link unfurls in Slack/iMessage/Twitter. Add `og:title`, `og:description`, `og:image`, `twitter:card` to `index.html` (or via TanStack Router `head:` option on routes).
- [ ] **First real deploy** — `pnpm run cf:deploy`. Creates the Worker on Cloudflare, gives you a `<name>.<account>.workers.dev` URL to verify everything works.
- [ ] **Custom domain (`ehrax.dev`)** — after first deploy: in Cloudflare dashboard → Workers → ehrax-dev → Settings → Triggers → Custom Domains → add `ehrax.dev` and optionally `www.ehrax.dev`. CF auto-configures DNS since the zone is on CF already. Alternative: add a `routes` array to `wrangler.jsonc` with `{ "pattern": "ehrax.dev", "custom_domain": true }`.
- [ ] **Workers Builds (Git CD)** — Cloudflare's equivalent of Pages git integration. Connect repo in dashboard → Workers → Builds. Auto-deploys on push, per-PR preview URLs. Replaces having to run `cf:deploy` manually.
- [ ] **Enable Cloudflare Web Analytics** — once Worker is deployed, enable Web Analytics for the project (CF Workers dashboard → Analytics tab). No code change needed; beacon is auto-injected. CSP already permits the analytics origins.

## Medium leverage

- [ ] **`robots.txt`** — `public/robots.txt`. Allow everything for now, or block crawlers on a staging domain.

## Low leverage / nice to have

- [ ] **`sitemap.xml`** — tiny site; only worth it once there's `/work/<slug>` or `/blog`.
- [ ] **Web app manifest** — `manifest.webmanifest` + theme color + icons for "Add to home screen".
- [ ] **Bundle split for SceneMount** — currently **877 KB** (R3F + drei + postprocessing). Already lazy-loaded behind `sceneEnabled` so non-blocking, but worth splitting further (e.g. lazy postprocessing pass) if scene load latency shows up.
- [ ] **Preload critical fonts** — once a custom font is chosen.

## Hosting (Cloudflare Workers + Static Assets)

- **Worker name**: `ehrax-dev`. Pure-static deploy: no `main` (no Worker code yet). Adding `main` later turns this into a hybrid Worker (static + serverless handlers in the same deployment).
- **SPA fallback** is configured via `assets.not_found_handling: "single-page-application"` in `wrangler.jsonc` — this replaces the old Pages `_redirects` file. Any unmatched URL returns `200` with `index.html`.
- **Headers** still live in `public/_headers` (Workers Static Assets supports the same Pages-flavored format). Security headers on `/*`, immutable cache on `/assets/*`.
- **Trailing-slash policy**: `assets.html_handling: "drop-trailing-slash"` — `/about/` redirects to `/about`.
- **Observability** is enabled in `wrangler.jsonc` (`head_sampling_rate: 1`). Logs/traces are visible in the CF Workers dashboard once deployed.
- **Compatibility date**: `2026-05-01`. Bump quarterly to pick up new runtime features (see https://developers.cloudflare.com/workers/configuration/compatibility-dates/).
- **Web Analytics** is auto-injected for Workers served via CF; no NPM package. CSP allows `static.cloudflareinsights.com` (script) and `cloudflareinsights.com` (beacon).
- **Wrangler commands** (all run via `pnpm exec wrangler ...` or the `cf:*` scripts):
  - `pnpm run cf:dev` — local preview using workerd
  - `pnpm run cf:deploy:dry` — build + validate config without deploying
  - `pnpm run cf:deploy` — build + deploy to Cloudflare
  - `pnpm run cf:types` — generate `worker-configuration.d.ts` (needed once Worker code with bindings is added)

## CI/CD split

- **CI** (this repo's `.github/workflows/ci.yml`): runs `biome check`, `pnpm run build` (which generates routeTree.gen.ts + runs `tsc -b`), and `vitest run` on every PR and push to `main`. No Playwright (e2e left for manual runs to save GH compute minutes).
- **CD**: Cloudflare Workers Builds git integration (set up once via dashboard) — pushes to `main` deploy to production; pushes to branches/PRs create preview URLs.

## Package manager + Node

- **pnpm** (10.33.2) is the package manager — pinned via `packageManager` field. Use `pnpm install`, `pnpm run <script>`, never `npm`.
- **Node 26.1.0** pinned in `.node-version` and `engines.node`. `.npmrc` has `engine-strict=true` so pnpm refuses to install on the wrong version.
- Enable fnm auto-switch in shell so the project Node version activates on `cd`: add `eval "$(fnm env --use-on-cd)"` to `~/.config/fish/config.fish` (or shell equivalent).
- `pnpm.onlyBuiltDependencies: ["esbuild", "sharp", "workerd"]` allowlist is required because pnpm 10 blocks postinstall scripts by default; sharp (via vite-imagetools), esbuild (via wrangler), and workerd (the local Workers runtime) all need their native binary installs.

## Build script note

- `package.json` `build` is `vite build && tsc -b`. The TanStack Router Vite plugin must generate `src/routeTree.gen.ts` before tsc can typecheck `~/routeTree.gen` imports.
- `pnpm run typecheck` runs tsc alone if you want to typecheck without bundling (but only works after a previous build generated the route tree).
- `pnpm run analyze` runs `ANALYZE=true vite build` — opens `dist/stats.html` (rollup-plugin-visualizer) for bundle inspection.

## Available libraries (installed, not yet used)

- **Motion** — `import { motion } from "motion/react"` (formerly framer-motion). Use for section reveals, nav transitions, page mount animations.
- **vite-imagetools** — image transforms at build time. Activate per-import with query params, e.g. `import hero from "./hero.jpg?w=800;1600&format=webp;avif&as=picture"`.
- **rollup-plugin-visualizer** — bundle analyzer, gated by `ANALYZE=true` env. Run `pnpm run analyze` to diagnose the 877 KB SceneMount chunk.
- **vite-plugin-svgr** — `import Logo from "./logo.svg?react"` to get an SVG as a React component. SVGO runs automatically (strips metadata, simplifies paths).
- **unplugin-icons + Iconify** — `import IconMenu from "~icons/lucide/menu"` or `import IconGithub from "~icons/simple-icons/github"`. Tree-shaken at build, zero runtime. Pre-installed sets: `@iconify-json/lucide` (UI icons) and `@iconify-json/simple-icons` (brand logos). Add more sets via `pnpm i -D @iconify-json/<set>`.
- **TanStack Router head/meta API** — no install needed (it's part of `@tanstack/react-router`). Use the `head:` option on `createFileRoute`/`createRootRoute` to set per-route `<title>` and OG tags. Replaces the OG/Twitter TODO above.

## CSP follow-ups (when adding third parties)

The CSP in `public/_headers` is strict (`default-src 'self'`, no `'unsafe-eval'`, no inline scripts; Cloudflare Web Analytics already permitted). When you add any of the below, the CSP needs corresponding origins added:

- **Google Fonts** (don't — prefer self-hosted Fontsource) → `font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`.
- **External images / CDN** → add the origin to `img-src`.
- **CF preview deploys** — Workers Builds preview URLs open in their own tab; current CSP `frame-ancestors 'none'` doesn't impact them.

The inline theme-init script that used to live in `index.html` was extracted to `public/theme-init.js` so strict CSP can ban all inline scripts. If you re-add inline scripts, you'll need either a SHA256 hash entry in CSP or `'unsafe-inline'` (which defeats the point).

## Decisions parked (revisit when symptom appears)

- **TanStack Query** — only when fetching real server state.
- **TanStack Form** — only when Contact section becomes a real form with submission.
- **Sentry** — only when there are real users + bugs worth tracking.
- **PWA / web manifest** — only if "install to home screen" becomes a goal.
- **Playwright in CI** — currently runs locally only. Move to a separate workflow with manual trigger or schedule if e2e regressions become a thing.
- **Adding Worker code (`main` field)** — start when you need server-side logic: contact form submission, edge auth, OG image generation, a real API. Then run `pnpm run cf:types` to regenerate bindings.
