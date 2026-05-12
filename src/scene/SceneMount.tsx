import { Canvas } from "@react-three/fiber";
import styles from "./SceneMount.module.css";
import { SceneRoot } from "./SceneRoot";

export function SceneMount() {
  return (
    <div className={styles.mount}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <SceneRoot />
      </Canvas>
    </div>
  );
}
