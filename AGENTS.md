# AGENTS.md

## Mission

- Keep the codebase easy to understand, test, and change.
- Work in the project's domain language, and make that language sharper when the work reveals a better name.
- Prefer changes that increase leverage for callers and locality for maintainers.
- Leave behind clear evidence: tests, browser checks when relevant, telemetry where it helps future debugging, and concise notes about the behavior verified.

## Tooling

- Use the `fff` MCP tools for all file search work.

## Architecture

- Favor deep modules: put meaningful behavior behind small interfaces so callers get leverage and maintainers get locality.
- Use the project domain language in `CONTEXT.md` when naming modules and seams. Check relevant ADRs in `docs/adr/` before proposing architecture changes.
- Treat a module as anything with an interface and an implementation: a function, class, package, or slice.
- Treat an interface as everything a caller must know: types, invariants, ordering, error modes, configuration, and performance expectations.
- Treat implementation as the code inside the module.
- Treat depth as leverage at the interface: a lot of behavior behind a small interface. Deep modules give callers leverage; shallow modules expose nearly as much complexity as they hide.
- Treat a seam as the place an interface lives, where behavior can be altered without editing in place.
- Treat an adapter as a concrete thing satisfying an interface at a seam.
- Use the deletion test for suspected shallow modules: if deleting the module only moves its complexity into callers, it was earning its keep; if complexity disappears, it was likely pass-through structure.
- Make the interface the test surface. If tests need to reach past the interface to prove behavior, reconsider where the seam belongs.
- Do not introduce a seam just for theoretical flexibility. One adapter means a hypothetical seam; two adapters means the seam is real.
- When asked to improve architecture, first present deepening opportunities with files, problem, solution, and benefits before proposing concrete interfaces.
- Explain benefits in terms of leverage, locality, and how tests improve.
- If a new architectural term becomes load-bearing, add it to `CONTEXT.md`; if a rejected direction is load-bearing, offer to record the reason as an ADR.

## Workflow

- Use the `tdd` skill for implementation tasks. Work in vertical tracer bullets: one behavior test, minimal implementation, then the next behavior.
- Use the `browser:browser` skill for debugging your changes. Browser debugging is always allowed and required when validating UI or browser-visible behavior.
- Add telemetry for yourself where it helps you debug better and find issues faster.
- If creating an MR, post test evidence. For UI or browser-visible work, use `browser:browser` to take a screenshot and include it with the MR evidence.
