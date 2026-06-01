# ehrax.dev

Turborepo monorepo for the ehrax.dev personal site — a static, scroll-driven, Three.js-heavy landing page plus a reusable, Base-UI-powered design system.

See `AGENTS.md` for working agreements and `CONTEXT.md` for the domain language and decisions behind the structure.

## Layout

```
apps/
  web/                 # @ehrax/web — the landing page (Vite + React + TanStack Router, R3F scene)
  storybook/           # @ehrax/storybook — token galleries + primitive stories (@storybook/react-vite)
packages/
  design-system/       # @ehrax/design-system — three-tier tokens → generated --ex-* CSS vars + theme provider
  ui/                  # @ehrax/ui — Base UI primitives (NavBar, Button, Card) styled with CSS Modules
  typescript-config/   # @ehrax/typescript-config — shared tsconfig bases
```

## Tooling

- **pnpm** workspaces + **Turborepo** task orchestration
- **Vite 8** + **React 19** + **TypeScript 6**; **TanStack Router** (file-based) for the app
- **React Three Fiber** + **Three.js** scene layer (lazy-loaded behind the DOM shell)
- **Base UI** (`@base-ui/react`) primitives + **CSS Modules** over `--ex-*` design tokens (no Tailwind, no runtime CSS-in-JS)
- **Zustand** for shared state, **Zod** for content/config validation, **i18next** for copy
- **Biome 2** for lint + format, **Vitest 4** + Testing Library for units, **Playwright** for e2e
- Deployed static to **Cloudflare** via Wrangler

Node is pinned in `.node-version` (run `fnm use` / `nvm use`).

## Scripts (run from the repo root)

```sh
pnpm web:dev            # start the landing-page dev server
pnpm storybook          # start Storybook (component workbench)
pnpm build              # turbo: build the app + typecheck the packages
pnpm typecheck          # turbo: tsc across the workspace
pnpm test               # turbo: Vitest (jsdom)
pnpm lint               # turbo: Biome lint
pnpm check              # turbo: lint + typecheck + test
pnpm format             # Biome write
pnpm design-system:generate:css   # regenerate themes/*.css from the TS tokens
pnpm web:deploy         # build + wrangler deploy
```

Focus a single package with `pnpm --filter @ehrax/<name> <task>`.

## Design system

Tokens live in TypeScript under `packages/design-system/src/tokens` in three tiers — **primitive** (palette ramps, type ladder, spacing, radii, motion), **semantic** (light/dark surface, text, border, intent × variant), and **component**. A generator emits them to `--ex-*` CSS custom properties (`pnpm design-system:generate:css`); never hand-edit the generated `src/themes/*.css`.

Primitives in `@ehrax/ui` wrap Base UI parts and style them with co-located CSS Modules reading those variables. The promotion ladder is tokens → primitives → patterns → layouts → pages; `@ehrax/ui` stays domain-free while domain components live in `apps/web`.

## Theming

System-first light/dark with a manual override, driven by `data-theme` on `<html>`. A small inline boot script in `apps/web/index.html` applies the stored preference before React mounts to avoid a flash. The design-system themes (`@ehrax/design-system/themes/{light,dark}.css`) and the app's own scene tokens both switch on the same attribute.
