# ehrax.dev

Static single-page React scaffold for the future scroll-driven, Three.js-heavy personal landing page.

The scaffold is provisional: copy, palette, typography, and the final 3D world are intentionally deferred. See `CONTEXT.md` for the domain language and decisions behind the structure.

## Node version

Pinned to **24.13.1** via `.node-version` (compatible with `fnm`, `nvm`, `volta`, `asdf`).

```sh
fnm use            # picks up .node-version
# or
nvm use            # same
```

## Stack

- **Vite 8** + **React 19** + **TypeScript 6**
- **React Three Fiber 9**, **Three.js**, **@react-three/drei 10**, **@react-three/postprocessing 3** (TSL-ready scene layer)
- **Zustand 5** for shared app/scene state (no per-frame values)
- **Zod 4** for content/config validation
- **i18next 26** / **react-i18next 17** (English only for now)
- **CSS Modules** + global CSS variable design system (no Tailwind, no runtime CSS-in-JS)
- **Biome 2** for lint + format
- **Vitest 4** + **React Testing Library** + **jest-dom** for unit tests
- **Playwright** for browser-level smoke tests

## Scripts

```sh
npm run dev        # start Vite dev server
npm run build      # type-check and produce static assets
npm run preview    # preview the production build
npm test           # run Vitest (jsdom)
npm run test:e2e   # run Playwright smoke
npm run check      # Biome lint + format check
npm run format     # Biome write
```

## Folder layout

```
src/
  App.tsx, main.tsx          # React shell entry
  data/                      # Localized content modules (en.ts)
  hooks/                     # DOM/state hooks
  i18n/                      # i18next initialization
  schemas/                   # Zod schemas
  scene/                     # React Three Fiber subtree (Canvas, scenes, materials, shaders, postprocessing)
  sections/                  # Hero, About, Work, Contact
  state/                     # Zustand stores (appStore, sceneStore)
  styles/                    # Global CSS (reset, tokens, themes, typography, base)
  types/                     # Shared TypeScript types
  ui/                        # DOM UI primitives (Nav, Section, ThemeToggle)
tests/e2e/                   # Playwright specs
```

## Theming

System-first light/dark theme with a manual override. Preference cycles `system → dark → light → system…` via the nav toggle and is persisted in `localStorage` under `theme-preference`. A small inline boot script in `index.html` applies the stored preference before React mounts to avoid a flash.

Color, typography, spacing, and layout tokens live as CSS variables in `src/styles/`. Component styling uses CSS Modules; global CSS is limited to reset, base, themes, tokens, typography, and spacing.

## Scene layer

The R3F subtree under `src/scene/` is intentionally minimal. It mounts a fixed-position Canvas behind the DOM with no fake final visuals — only ambient and directional light. Future scenes, objects, materials, shaders, and postprocessing have dedicated subdirectories. The Canvas chunk is lazy-loaded so the initial JS payload stays focused on the DOM shell.
