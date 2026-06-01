# ehrax.dev

## Mission
- Build and maintain the ehrax.dev monorepo: the landing-page app (`apps/web`), the design system (`packages/design-system`), the UI primitives (`packages/ui`), and the component workbench (`apps/storybook`).
- The site is a static, scroll-driven, Three.js-heavy personal landing page deployed to Cloudflare. Keep it fast, accessible, resilient, and a pleasure to read.
- Prefer reliable, accessible behavior and a coherent design system over clever abstractions. Stay especially careful around theming, the 3D scene's performance, i18n, SEO/static output, and cross-package boundaries.
- Work in the project's domain language, and sharpen that language when the work reveals a better name.

## Tooling
- Use the `fff` MCP tools for all file search work.
- Package manager is **pnpm** (workspaces); orchestration is **Turborepo**. Root scripts delegate through `turbo run`.
- Lint + format is **Biome** (single root `biome.json`); there is no ESLint/Prettier.
- Node is pinned in `.node-version`.

## Source Of Truth
- Runtime app code: `apps/web` (TanStack Router SPA, R3F scene, i18n, SEO).
- Design tokens + theme: `packages/design-system` — three-tier tokens (primitive → semantic → component) generated to `--ex-*` CSS variables.
- UI primitives: `packages/ui` — Base UI (`@base-ui/react`) components styled with CSS Modules against the design-system tokens.
- Component workbench: `apps/storybook` — token galleries + primitive stories.
- Shared TS config: `packages/typescript-config`.
- Project domain language: `CONTEXT.md`. Architecture decisions: `docs/adr/` when present.
- Local workflows: root `package.json`, `pnpm-workspace.yaml`, `turbo.json`.

## Stack
- Monorepo: pnpm + Turborepo with package-owned tasks and root scripts delegating through `turbo run`.
- App: Vite + React 19 + TypeScript 6, TanStack Router (file-based), deployed static to Cloudflare via Wrangler.
- Scene: React Three Fiber + Three.js, lazy-loaded behind the DOM shell; no per-frame values in shared state.
- State: Zustand only for shared app/scene state (theme preference, active section, scene flags). Zod for content/config validation.
- Design system: design tokens in `packages/design-system`, Base UI primitives in `packages/ui`. CSS Modules + global CSS variables; no Tailwind, no runtime CSS-in-JS.
- Storybook: `@storybook/react-vite`, dark-first, with a theme + surface toolbar.

## Safety Guardrails
- Read current code before changing behavior. Fix root causes and preserve unrelated user changes.
- Keep UI accessible and localized: use i18n keys, prefer visible labels for tests, avoid hardcoded user-facing strings, respect `prefers-reduced-motion`, and keep focus-visible affordances.
- The landing page output is static and SEO-sensitive. The `apps/web` SEO scripts patch `index.html`; keep generated `<head>` metadata and structured data valid, and verify the static deploy when SEO or routing changes.
- Theme is driven by `data-theme` on `<html>` with a pre-paint boot script to avoid a flash. Keep light/dark parity and never hardcode a raw color when a token exists.
- Keep the 3D scene cheap: lazy-load the Canvas, avoid heavy work on the main thread, and budget for low-end devices.

## Architecture
- Favor deep modules: put meaningful behavior behind small interfaces so callers get leverage and maintainers get locality.
- Use the project domain language in `CONTEXT.md` when naming modules and seams. Check relevant ADRs in `docs/adr/` before proposing architecture changes.
- Treat a module as anything with an interface and an implementation; treat the interface as everything a caller must know (types, invariants, ordering, error modes, configuration, performance expectations).
- Treat depth as leverage at the interface: a lot of behavior behind a small interface. Shallow pass-through modules that only relay complexity to callers are suspect.
- Use the deletion test for suspected shallow modules: if deleting the module only moves its complexity into callers, it earned its keep; if complexity disappears, it was pass-through structure.
- Make the interface the test surface. If tests must reach past the interface to prove behavior, reconsider where the seam belongs.
- Do not introduce a seam just for theoretical flexibility. One adapter means a hypothetical seam; two adapters means the seam is real.
- Shared code must earn its place. One-app behavior stays in that app; promote to a package only when a second real caller needs it.
- If a new architectural term becomes load-bearing, add it to `CONTEXT.md`; if a rejected direction is load-bearing, offer to record the reason as an ADR.

## Design System & UI Layering
- Use the design system first for all UI work. Build from `packages/design-system` tokens and the `packages/ui` primitives. Do not hand-roll a component, raw color, spacing, radius, or one-off CSS value when a token or primitive exists; if one is missing, add it to the package rather than inline in the app.
- Tokens are the single source of truth in TypeScript. Edit the token files in `packages/design-system/src/tokens`, then run `pnpm design-system:generate:css` — never hand-edit the generated `src/themes/*.css`.
- Promotion ladder: tokens → primitives → patterns → layouts → sections/pages. Knowledge increases as you climb. `packages/ui` stays domain-free (no ehrax-specific copy, no scene/route knowledge); domain components, layouts, and sections live in `apps/web` once they know a domain noun.
- Primitives wrap Base UI parts, merge `className` via `clsx`, and style with a co-located CSS Module reading `--ex-*` variables and `data-*` attributes. Keep components accessible by leaning on Base UI's semantics.
- Promote on the second real caller. One caller stays app-local; two real callers earn a shared primitive — lift it, do not fork it.

## Engineering Discipline
- Write the smallest code that solves the requested problem. Do not add speculative features, abstractions, configuration, or extension points.
- Touch only what the request requires. Match existing style and local patterns.
- Remove only unused code introduced by your own change.
- Avoid huge files and components; split by responsibility when a file stops being easy to scan.
- Every changed line should trace to the request, a failing test, or a required invariant.

## Workflow
- For behavior changes or feature work, use the `tdd` skill and prove changed production behavior with automated tests. Work in vertical tracer bullets: one behavior test, minimal implementation, then the next behavior.
- Use the `browser` skill to validate UI or browser-visible behavior; browser debugging is always allowed and required when validating visible changes. Include a screenshot with MR evidence for UI work.
- Use focused package scripts while iterating (`pnpm web:dev`, `pnpm storybook`, `pnpm --filter @ehrax/<pkg> <task>`). Root confidence checks are `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` (all Turbo-orchestrated).
- After editing design tokens, run `pnpm design-system:generate:css` and review the regenerated CSS.
- Choose verification commands that match the files and behavior changed. Put a hard bound on commands that can hang or run open-ended; never leave dev servers, watches, or log follows running indefinitely.
