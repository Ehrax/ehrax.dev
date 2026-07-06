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

## Picking models for delegated work

Rankings, higher = better. Cost reflects real subscription pressure, not list price.
Intelligence = how hard a problem the model handles unsupervised. Taste = UI/UX, code
quality, API design, copy.

| model     | cost | intelligence | taste |
|-----------|------|--------------|-------|
| gpt-5.5   | 7    | 8            | 5     |
| opus-4.8  | 4    | 7            | 8     |
| sonnet-5  | 6    | 5            | 7     |

- Don't start dev servers (assume one is already running) and don't run builds unless told — verify with the project's check commands (typecheck, lint, tests).
- If asked to do too much work at once, stop and state that clearly.
- If computer use helps to complete or verify work (clicking through a UI, screenshots), shell out to gpt-5.5 with codex — it has built-in computer use.
- Defaults, not limits: if a cheaper model's output misses the bar, redo with a smarter one without asking. Judge the output, not the price tag.
- When axes conflict for anything that ships: intelligence > taste > cost.
- Bulk/mechanical with a tight brief (clear-spec implementation, migrations, commit/push sweeps): gpt-5.5. Never pick haiku on your own — the user invokes it explicitly when wanted.
- Anything user-facing (UI, copy, API design) needs taste ≥ 7: opus-4.8, sonnet-5 as budget option.
- Default driver split: gpt-5.5 drives backend and logic work (services, data, glue — including logic inside frontend code); Claude drives frontend/visual work.
- Reviews of plans/implementations: opus-4.8, plus gpt-5.5 as an independent second perspective.
- Also on the codex account (via `codex -m`): gpt-5.4, gpt-5.4-mini, gpt-5.3-codex-spark (very fast execution) — the user invokes these explicitly; don't auto-pick them.
- Mechanics: gpt-5.5 only via the codex CLI (`codex exec` / `codex review`); Claude models via the Agent/Workflow `model` parameter. Full delegation playbook: the `orchestrate` skill.
