# ehrax.dev

Turborepo for a static, scroll-driven Three.js personal site, shared design-system/UI primitives, and Storybook; deployed to Cloudflare Workers.

Use current code and accepted ADRs as architecture authority. `CONTEXT.md` preserves domain language and early rationale, but its visual and theme status is historical. For positioning or copy, use `docs/PROFILE-CONTEXT.md`.

## Non-negotiables

- Edit design tokens in `packages/design-system/src/tokens`, not generated `packages/design-system/src/themes/*.css`; regenerate with `pnpm design-system:generate:css`.
- `apps/web/site.config.json` owns generated route, search-preview, social-card, sitemap, and structured-data fields; `apps/web/index.html` still owns `theme-color`. After changing SEO or routing, run `pnpm --filter @ehrax/web generate:seo` and `pnpm --filter @ehrax/web verify:static`.
- Keep `packages/ui` domain-free; app-specific components stay in `apps/web`.
