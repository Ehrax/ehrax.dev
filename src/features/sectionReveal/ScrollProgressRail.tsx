import type { CSSProperties } from "react";
import { useSceneStore } from "~/state/sceneStore";
import styles from "./ScrollProgressRail.module.css";

const TICKS = Array.from({ length: 11 }, (_, index) => index / 10);

export function ScrollProgressRail() {
  const scrollProgress = useSceneStore((s) => s.scrollProgress);

  return (
    <aside
      aria-hidden="true"
      className={styles.rail}
      data-scroll-progress-rail
      style={{ "--scroll-progress": scrollProgress.toFixed(4) } as CSSProperties}
    >
      <div className={styles.track} />
      {TICKS.map((tick) => (
        <span key={tick} className={styles.tick} style={{ "--tick-value": tick } as CSSProperties}>
          {tick.toFixed(2)}
        </span>
      ))}
    </aside>
  );
}
