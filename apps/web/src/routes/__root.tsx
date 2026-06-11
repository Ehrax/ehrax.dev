import { Text } from "@ehrax/ui";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useResolvedTheme } from "~/hooks/useResolvedTheme";
import { contactCanvasReveal, smooth01 } from "~/scene/scenes/landingTuning";
import { useSceneStore } from "~/state/sceneStore";
import { Nav } from "~/ui/Nav/Nav";
import styles from "./__root.module.css";

const SceneMount = lazy(() =>
  import("~/scene/SceneMount").then((mod) => ({ default: mod.SceneMount })),
);

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((mod) => ({
        default: mod.TanStackRouterDevtools,
      })),
    )
  : () => null;

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: RouteErrorFallback,
});

function RootLayout() {
  useResolvedTheme();
  const sceneEnabled = useSceneStore((s) => s.sceneEnabled);

  return (
    <div className={styles.shell}>
      {sceneEnabled ? (
        <div className={styles.sceneLayer} aria-hidden="true">
          <Suspense fallback={null}>
            <SceneMount />
          </Suspense>
          <SceneCover />
        </div>
      ) : null}
      <Nav />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.copyright}>
        <Text variant="caption" tone="secondary">
          © ehrax.dev — scaffold
        </Text>
      </footer>
      <Suspense fallback={null}>
        <RouterDevtools />
      </Suspense>
    </div>
  );
}

// Full-viewport flat canvas color between the scene and the content. Invisible
// over the hero/About (the scene background has already landed on the same
// color there), it solidly hides the scene's life (grain, fireflies, finale)
// behind the Work content, then lifts as the contact finale begins — a purely
// temporal reveal with no section edge to see. Driven imperatively per scroll
// tick; no React re-renders.
function SceneCover() {
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = coverRef.current;
    if (!el) return;
    const apply = (controllerValue: number, contactProgress: number) => {
      // Engages once the hero scene has gone dark (the gradient is flat by
      // then, so the hand-off is invisible); lifts with the contact reveal.
      const engaged = smooth01((controllerValue - 0.5) / 0.12);
      el.style.opacity = String(engaged * (1 - contactCanvasReveal(contactProgress)));
    };
    const state = useSceneStore.getState();
    apply(state.controllerValue, state.contactProgress);
    return useSceneStore.subscribe((s) => apply(s.controllerValue, s.contactProgress));
  }, []);

  return <div ref={coverRef} className={styles.sceneCover} />;
}

function RouteErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className={styles.fallback}>
      <p className={styles.fallbackEyebrow}>Error</p>
      <h1 className={styles.fallbackTitle}>Something broke</h1>
      <p className={styles.fallbackBody}>An unexpected error occurred while rendering this page.</p>
      {import.meta.env.DEV && error?.message ? (
        <pre className={styles.fallbackError}>{error.message}</pre>
      ) : null}
      <div className={styles.fallbackActions}>
        <button type="button" onClick={reset} className={styles.fallbackLink}>
          Try again
        </button>
        <Link to="/" className={styles.fallbackLink}>
          ← Back home
        </Link>
      </div>
    </section>
  );
}
