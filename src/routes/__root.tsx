import { Outlet, createRootRoute } from "@tanstack/react-router";
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
