import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { useResolvedTheme } from "~/hooks/useResolvedTheme";
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
        </div>
      ) : null}
      <Nav />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p className="t-caption">© ehrax.dev — scaffold</p>
      </footer>
      <Suspense fallback={null}>
        <RouterDevtools />
      </Suspense>
    </div>
  );
}

function RouteErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className={styles.fallback}>
      <p className={styles.fallbackEyebrow}>Error</p>
      <h1 className={styles.fallbackTitle}>Something broke</h1>
      <p className={styles.fallbackBody}>
        An unexpected error occurred while rendering this page.
      </p>
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
