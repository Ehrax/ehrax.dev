# Scene layer

This is the React Three Fiber subtree. Everything Three.js-specific lives here so the rest of the React app stays light and DOM-focused.

## Folders

- `SceneMount.tsx` — Canvas mount; the only place that imports `@react-three/fiber` `Canvas` for the landing experience.
- `SceneRoot.tsx` — Top-level scene composition. Compose scenes here.
- `scenes/` — Concrete scenes (e.g. `LandingScene`). One coherent evolving world is the target.
- `objects/` — Reusable 3D objects/components (geometry + assembly).
- `materials/` — Material wrappers; TSL-authored materials will live here behind the R3F boundary.
- `shaders/` — Shader sources (GLSL or TSL helpers). Materials reference these.
- `postprocessing/` — Postprocessing chain wiring.

## Conventions

- Direct imports only. No barrel `index.ts` re-exports across heavy R3F modules.
- React Three Fiber owns scene composition and lifecycle.
- TSL owns custom material/shader authoring.
- Animation-frame state stays in refs/`useFrame`. Do not store per-frame values in Zustand or React state.
- Section-driven changes (camera position, atmosphere, lighting) read from `useSceneStore`.
