# TODOS

Tracking items not yet done after the Vercel + TanStack Router setup.

## High leverage (do before first public deploy)

- [ ] **Favicon** — no `<link rel="icon">` in `index.html`. Drop SVG/PNG in `public/`, wire in `index.html`.
- [ ] **OG / Twitter meta tags** — for link unfurls in Slack/iMessage/Twitter. Add `og:title`, `og:description`, `og:image`, `twitter:card` to `index.html`.
- [ ] **404 route** — TanStack Router: add `notFoundComponent` on `__root.tsx`. Without it, unknown routes render a blank Outlet.
- [ ] **Root error boundary** — TanStack Router: add `errorComponent` on `__root.tsx` so render errors don't kill the whole page.
- [ ] **Security headers in `vercel.json`** — `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`. R3F needs careful CSP (eval/wasm for shaders).

## Medium leverage

- [ ] **Vercel Analytics + Speed Insights** — `@vercel/analytics` + `@vercel/speed-insights`, two lines in `__root.tsx`. Free on hobby tier.
- [ ] **`robots.txt`** — `public/robots.txt`. Allow everything for now, or block crawlers on a staging domain.
- [ ] **Set Vercel project Node version to 26** — `.node-version` pins `26.1.0` (current, not LTS). Vercel dashboard must match or builds fail. If unavailable, fall back to Node 24 LTS (update `.node-version`, `engines.node` in `package.json`).

## Low leverage / nice to have

- [ ] **`sitemap.xml`** — tiny site; only worth it once there's `/work/<slug>` or `/blog`.
- [ ] **Web app manifest** — `manifest.webmanifest` + theme color + icons for "Add to home screen".
- [ ] **Bundle split for SceneMount** — currently **877 KB** (R3F + drei + postprocessing). Already lazy-loaded behind `sceneEnabled` so non-blocking, but worth splitting further (e.g. lazy postprocessing pass) if scene load latency shows up.
- [ ] **Preload critical fonts** — once a custom font is chosen.

## Package manager + Node

- **pnpm** (10.33.2) is the package manager — pinned via `packageManager` field. Use `pnpm install`, `pnpm run <script>`, never `npm`.
- **Node 26.1.0** pinned in `.node-version` and `engines.node`. `.npmrc` has `engine-strict=true` so pnpm refuses to install on the wrong version.
- Enable fnm auto-switch in shell so the project Node version activates on `cd`: add `eval "$(fnm env --use-on-cd)"` to `~/.config/fish/config.fish` (or shell equivalent).
- `pnpm.onlyBuiltDependencies: ["sharp"]` allowlist is required because pnpm 10 blocks postinstall scripts by default; sharp (via vite-imagetools) needs its native binary install.

## Build script note

- `package.json` `build` is `vite build && tsc -b` (was `tsc -b && vite build`). The TanStack Router Vite plugin must generate `src/routeTree.gen.ts` before tsc can typecheck `~/routeTree.gen` imports.
- `pnpm run typecheck` runs tsc alone if you want to typecheck without bundling.
- `pnpm run analyze` runs `ANALYZE=true vite build` — opens `dist/stats.html` (rollup-plugin-visualizer) for bundle inspection.

## Available libraries (installed, not yet used)

- **Motion** — `import { motion } from "motion/react"` (formerly framer-motion). Use for section reveals, nav transitions, page mount animations.
- **vite-imagetools** — image transforms at build time. Activate per-import with query params, e.g. `import hero from "./hero.jpg?w=800;1600&format=webp;avif&as=picture"`.
- **rollup-plugin-visualizer** — bundle analyzer, gated by `ANALYZE=true` env. Run `npm run analyze` to diagnose the 877 KB SceneMount chunk.
- **vite-plugin-svgr** — `import Logo from "./logo.svg?react"` to get an SVG as a React component. SVGO runs automatically (strips metadata, simplifies paths).
- **unplugin-icons + Iconify** — `import IconMenu from "~icons/lucide/menu"` or `import IconGithub from "~icons/simple-icons/github"`. Tree-shaken at build, zero runtime. Pre-installed sets: `@iconify-json/lucide` (UI icons) and `@iconify-json/simple-icons` (brand logos). Add more sets via `pnpm i -D @iconify-json/<set>`.
- **TanStack Router head/meta API** — no install needed (it's part of `@tanstack/react-router`). Use the `head:` option on `createFileRoute`/`createRootRoute` to set per-route `<title>` and OG tags. Replaces the OG/Twitter TODO above.

## Decisions parked (revisit when symptom appears)

- **TanStack Query** — only when fetching real server state.
- **TanStack Form** — only when Contact section becomes a real form with submission.
- **Sentry** — only when there are real users + bugs worth tracking.
- **PWA / web manifest** — only if "install to home screen" becomes a goal.
