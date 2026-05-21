import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { GridHelper, Material, Mesh } from "three";
import type { SceneVisual } from "~/state/sceneStore";

type BlueprintFloorProps = {
  floorColor: string;
  gridPrimaryColor: string;
  gridSecondaryColor: string;
  visual: SceneVisual;
};

export function BlueprintFloor({
  floorColor,
  gridPrimaryColor,
  gridSecondaryColor,
  visual,
}: BlueprintFloorProps) {
  const gridRef = useRef<GridHelper>(null);
  const planeRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const targetOpacity = visual === "blueprint" ? 0.18 : 0.04;
    const material = gridRef.current?.material as Material | Material[] | undefined;
    const gridMaterial = Array.isArray(material) ? material[0] : material;
    if (gridMaterial) {
      gridMaterial.opacity += (targetOpacity - gridMaterial.opacity) * Math.min(delta * 5, 1);
    }

    if (planeRef.current) {
      planeRef.current.rotation.z += delta * 0.015;
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
