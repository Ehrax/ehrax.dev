import { Color } from "three";
import { useScenePalette } from "~/scene/useScenePalette";
import { useSceneStore } from "~/state/sceneStore";
import { BlueprintFloor } from "../objects/BlueprintFloor";
import { DotField } from "../objects/DotField";
import { ScrollGlyph } from "../objects/ScrollGlyph";

export function LandingScene() {
  const activeSection = useSceneStore((s) => s.activeSection);
  const progress = useSceneStore((s) => s.controllerValue);
  const visual = useSceneStore((s) => s.visual);
  const palette = useScenePalette();
  const backgroundColor = palette.background[visual];

  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[new Color(backgroundColor), 10, 34]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 5, 5]} intensity={1.15} />
      <pointLight
        position={[2.5, 1.5, 3]}
        intensity={visual === "neon" ? 18 : 3}
        color={palette.pointLight}
      />
      <DotField baseColor={palette.dotBase} dotColor={palette.dot[visual]} progress={progress} />
      <BlueprintFloor
        floorColor={palette.floor}
        gridPrimaryColor={palette.gridPrimary}
        gridSecondaryColor={palette.gridSecondary}
        visual={visual}
      />
      <ScrollGlyph
        activeSection={activeSection}
        emissiveColor={palette.glyphEmissive}
        glyphColor={palette.glyph[visual]}
        progress={progress}
        visual={visual}
      />
    </>
  );
}
