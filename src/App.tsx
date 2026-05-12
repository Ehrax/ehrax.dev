import { Suspense, lazy } from "react";
import { useActiveSection } from "~/hooks/useActiveSection";
import { useResolvedTheme } from "~/hooks/useResolvedTheme";
import { About } from "~/sections/About/About";
import { Contact } from "~/sections/Contact/Contact";
import { Hero } from "~/sections/Hero/Hero";
import { Work } from "~/sections/Work/Work";
import { useSceneStore } from "~/state/sceneStore";
import { Nav } from "~/ui/Nav/Nav";
import styles from "./App.module.css";

const SceneMount = lazy(() =>
  import("~/scene/SceneMount").then((mod) => ({ default: mod.SceneMount })),
);

export function App() {
  useResolvedTheme();
  useActiveSection();
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
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
      <footer className={styles.footer}>
        <p className="t-caption">© ehrax.dev — scaffold</p>
      </footer>
    </div>
  );
}
