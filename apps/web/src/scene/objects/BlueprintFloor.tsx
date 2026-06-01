import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { GridHelper, Material, Mesh } from "three";
import { getSceneGridOpacity } from "~/scene/sceneTransition";
import type { SceneVisual } from "~/state/sceneStore";

type BlueprintFloorProps = {
  effectOpacity: number;
  floorColor: string;
  gridPrimaryColor: string;
  gridSecondaryColor: string;
  progress: number;
  visual: SceneVisual;
};

export function BlueprintFloor({
  effectOpacity,
  floorColor,
  gridPrimaryColor,
  gridSecondaryColor,
  progress,
  visual,
}: BlueprintFloorProps) {
  const gridRef = useRef<GridHelper>(null);
  const planeRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const lineFade = getSceneGridOpacity(progress) * effectOpacity;
    const targetOpacity = (visual === "blueprint" ? 0.18 : 0.04) * lineFade;
    const material = gridRef.current?.material as Material | Material[] | undefined;
    const gridMaterial = Array.isArray(material) ? material[0] : material;
    if (gridMaterial) {
      gridMaterial.opacity += (targetOpacity - gridMaterial.opacity) * Math.min(delta * 5, 1);
    }

    if (planeRef.current) {
      planeRef.current.rotation.z += delta * 0.015;
      const planeMaterial = planeRef.current.material as Material | Material[] | undefined;
      const surfaceMaterial = Array.isArray(planeMaterial) ? planeMaterial[0] : planeMaterial;
      if (surfaceMaterial) {
        surfaceMaterial.opacity +=
          (0.04 * lineFade - surfaceMaterial.opacity) * Math.min(delta * 5, 1);
      }
    }
  });

  return (
    <group position={[0, -3.15, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={planeRef}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color={floorColor} transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <gridHelper ref={gridRef} args={[28, 48, gridPrimaryColor, gridSecondaryColor]}>
        <meshBasicMaterial transparent opacity={0.08} />
      </gridHelper>
    </group>
  );
}
