# ehrax.dev

Static, scroll-driven Three.js personal landing page (`apps/web`) + design system (`packages/design-system`) + UI primitives (`packages/ui`) + component workbench (`apps/storybook`), deployed static to Cloudflare via Wrangler.

Domain language/invariants: `CONTEXT.md` — read before nontrivial changes. Positioning/copy brief: `docs/PROFILE-CONTEXT.md`. No `docs/adr/` yet.

## Commands
- `pnpm design-system:generate:css` — regenerate `--ex-*` CSS after editing tokens in `packages/design-system/src/tokens`; never hand-edit the generated `src/themes/*.css`.
- `pnpm web:dev`, `pnpm storybook`, `pnpm --filter @ehrax/<pkg> <task>` for focused iteration.

## Footguns
- Generated theme CSS (`packages/design-system/src/themes/*.css`) is build output — edit tokens, not the CSS.
- Theme uses a pre-paint boot script setting `data-theme` on `<html>` to avoid a flash — don't remove it.
- `apps/web` SEO scripts patch `index.html`; verify static deploy after touching SEO/routing.
- Promote to `packages/ui` only on the second real caller — one caller stays app-local.
