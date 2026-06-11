import { Canvas } from "@react-three/fiber";
import styles from "./SceneMount.module.css";
import { SceneRoot } from "./SceneRoot";

export function SceneMount() {
  return (
    <div className={styles.mount}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
        // Low-end budget: 12k additive particles + mipmap bloom; capping at
        // 1.75x dpr keeps the post chain affordable on high-density screens.
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <SceneRoot />
      </Canvas>
    </div>
  );
}
