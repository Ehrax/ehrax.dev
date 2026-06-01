import { Color } from "three";
import { getSceneColorMix, getSceneEffectOpacity } from "~/scene/sceneTransition";
import { useScenePalette } from "~/scene/useScenePalette";
import { useSceneStore } from "~/state/sceneStore";
import { BlueprintFloor } from "../objects/BlueprintFloor";
import { DotField } from "../objects/DotField";
import { ScrollGlyph } from "../objects/ScrollGlyph";

type ColorStops = {
  blueprint: string;
  halftone: string;
  neon: string;
};

function mixColorStops(stops: ColorStops, progress: number): string {
  const { finalMix, holdMix } = getSceneColorMix(progress);
  const color = new Color(stops.halftone);

  color.lerp(new Color(stops.blueprint), holdMix);
  color.lerp(new Color(stops.neon), finalMix);

  return `#${color.getHexString()}`;
}

export function LandingScene() {
  const activeSection = useSceneStore((s) => s.activeSection);
  const progress = useSceneStore((s) => s.controllerValue);
  const visual = useSceneStore((s) => s.visual);
  const palette = useScenePalette();
  const backgroundColor = mixColorStops(palette.background, progress);
  const dotColor = mixColorStops(palette.dot, progress);
  const effectOpacity = getSceneEffectOpacity(progress);
  const glyphColor = mixColorStops(palette.glyph, progress);

  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[new Color(backgroundColor), 10, 34]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 5, 5]} intensity={1.15} />
      <pointLight
        position={[2.5, 1.5, 3]}
        intensity={(visual === "neon" ? 18 : 3) * effectOpacity}
        color={palette.pointLight}
      />
      <DotField
        baseColor={palette.dotBase}
        dotColor={dotColor}
        opacity={effectOpacity}
        progress={progress}
      />
      <BlueprintFloor
        effectOpacity={effectOpacity}
        floorColor={palette.floor}
        gridPrimaryColor={palette.gridPrimary}
        gridSecondaryColor={palette.gridSecondary}
        progress={progress}
        visual={visual}
      />
      <ScrollGlyph
        activeSection={activeSection}
        effectOpacity={effectOpacity}
        emissiveColor={palette.glyphEmissive}
        glyphColor={glyphColor}
        progress={progress}
        visual={visual}
      />
    </>
  );
}
