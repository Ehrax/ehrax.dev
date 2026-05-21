import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, type Group, MathUtils, type MeshStandardMaterial } from "three";
import type { SceneSection, SceneVisual } from "~/state/sceneStore";

type ScrollGlyphProps = {
  activeSection: SceneSection;
  emissiveColor: string;
  glyphColor: string;
  progress: number;
  visual: SceneVisual;
};

const sectionOffset: Record<SceneSection, number> = {
  about: 1.35,
  contact: 0,
  hero: 0.8,
  work: 1.2,
};

export function ScrollGlyph({
  activeSection,
  emissiveColor,
  glyphColor,
  progress,
  visual,
}: ScrollGlyphProps) {
  const groupRef = useRef<Group>(null);
  const firstMaterial = useRef<MeshStandardMaterial>(null);
  const secondMaterial = useRef<MeshStandardMaterial>(null);
  const thirdMaterial = useRef<MeshStandardMaterial>(null);

  useFrame(({ camera, pointer }, delta) => {
    const easedProgress = MathUtils.smoothstep(progress, 0, 1);
    const targetColor = new Color(glyphColor);
    const targetEmissive = new Color(emissiveColor);
    const targetOpacity = visual === "blueprint" ? 0.2 : 0.38;
    const targetEmissiveIntensity = visual === "neon" ? 0.55 : 0;

    for (const material of [firstMaterial.current, secondMaterial.current, thirdMaterial.current]) {
      if (!material) continue;
      material.color.lerp(targetColor, Math.min(delta * 4, 1));
      material.emissive.lerp(targetEmissive, Math.min(delta * 5, 1));
      material.emissiveIntensity = MathUtils.damp(
        material.emissiveIntensity,
        targetEmissiveIntensity,
        5,
        delta,
      );
      material.opacity += (targetOpacity - material.opacity) * Math.min(delta * 4, 1);
      material.wireframe = visual === "blueprint";
    }

    if (groupRef.current) {
      const targetX = sectionOffset[activeSection] + (visual === "blueprint" ? 0.35 : 0);
      groupRef.current.rotation.y = MathUtils.damp(
        groupRef.current.rotation.y,
        (easedProgress - 0.5) * Math.PI * 4 + pointer.x * 0.2,
        4,
        delta,
      );
      groupRef.current.rotation.x = MathUtils.damp(
        groupRef.current.rotation.x,
        pointer.y * 0.16 - easedProgress * 0.3,
        4,
        delta,
      );
      groupRef.current.position.y = MathUtils.damp(
        groupRef.current.position.y,
        Math.sin(easedProgress * Math.PI) * 0.5,
        4,
        delta,
      );
      groupRef.current.position.x = MathUtils.damp(groupRef.current.position.x, targetX, 4, delta);
      groupRef.current.scale.setScalar(0.72 + Math.sin(easedProgress * Math.PI) * 0.06);
    }

    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * 1.1, 3, delta);
    camera.position.y = MathUtils.damp(camera.position.y, 0.2 + pointer.y * 0.5, 3, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 6 - easedProgress * 1.1, 3, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <Float speed={4} rotationIntensity={0.08} floatIntensity={0.45}>
      <group ref={groupRef} rotation={[0, -Math.PI, 0]}>
        <mesh position={[0.75, 0.15, 0]} rotation={[0.2, 0, -0.22]}>
          <capsuleGeometry args={[0.28, 2.7, 12, 32]} />
          <meshStandardMaterial
            ref={firstMaterial}
            color={glyphColor}
            transparent
            opacity={0.82}
            roughness={0.18}
          />
        </mesh>
        <mesh position={[-0.75, -0.2, 0]} rotation={[-0.2, 0, 0.22]}>
          <capsuleGeometry args={[0.28, 2.65, 12, 32]} />
          <meshStandardMaterial
            ref={secondMaterial}
            color={glyphColor}
            transparent
            opacity={0.82}
            roughness={0.18}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, -0.7]}>
          <torusGeometry args={[0.96, 0.22, 24, 96, Math.PI * 1.32]} />
          <meshStandardMaterial
            ref={thirdMaterial}
            color={glyphColor}
            transparent
            opacity={0.82}
            roughness={0.18}
          />
        </mesh>
      </group>
    </Float>
  );
}
