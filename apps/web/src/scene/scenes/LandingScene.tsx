// Production hero scene: a tilted 3D blueprint drafting floor that rolls open
// like a book on load, a galaxy-spiral particle wordmark that morphs into a
// churning sphere on scroll, telemetry panels in the table plane, and an
// analog post chain over everything. Scroll blends the blueprint blue exactly
// onto var(--ex-surface-canvas) via getSceneColorMix.
import { useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { Color, type Group } from "three";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import { getSceneColorMix } from "~/scene/sceneTransition";
import { useScenePalette } from "~/scene/useScenePalette";
import { useSceneStore } from "~/state/sceneStore";
import { AnalogOverlay } from "../objects/AnalogOverlay";
import { BlueprintFloor } from "../objects/BlueprintFloor";
import { ContactLinks } from "../objects/ContactLinks";
import { Fireflies } from "../objects/Fireflies";
import { HeadlineParticles } from "../objects/HeadlineParticles";
import { TelemetryPanels } from "../objects/TelemetryPanels";
import { AnalogPostChain } from "../postprocessing/AnalogPostChain";
import {
  BLUEPRINT_HOLD,
  BLUEPRINT_START,
  bookRoll,
  ENTRANCE_SECONDS,
  smooth01,
} from "./landingTuning";

// One rig holds the floor AND the wordmark so they always move as a single
// physical scene. On entry the page rolls open like a book, then holds static.
function SceneRig({ children }: { children: ReactNode }) {
  const groupRef = useRef<Group>(null);
  const settleRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((_, delta) => {
    settleRef.current = reducedMotion
      ? 1
      : Math.min(1, settleRef.current + delta / (ENTRANCE_SECONDS * 0.9));
    if (!groupRef.current) return;
    const open = smooth01(settleRef.current);
    // Closed page: tipped toward the viewer, lower and further away. It eases
    // open into place; scrolling rolls the whole table over like a book page
    // turning away (the blob counters this roll to stay centered).
    const roll = bookRoll(useSceneStore.getState().controllerValue);
    groupRef.current.rotation.x = -0.55 * (1 - open) - roll * 0.8;
    groupRef.current.position.y = -0.7 * (1 - open) - roll * 1.6;
    groupRef.current.position.z = -2.2 * (1 - open) - roll * 1.2;
  });

  return <group ref={groupRef}>{children}</group>;
}

// Scroll-driven gradient, mutated in place in useFrame — zero React re-renders
// per scroll tick. The final stop IS var(--ex-surface-canvas), so the canvas
// lands exactly on the content background — no seam at the end of the journey.
function SceneBackground() {
  const scene = useThree((state) => state.scene);
  const palette = useScenePalette();
  const startColor = useMemo(() => new Color(BLUEPRINT_START), []);
  const holdColor = useMemo(() => new Color(BLUEPRINT_HOLD), []);
  const finalColor = useMemo(() => new Color(), []);
  const scratchColor = useMemo(() => new Color(BLUEPRINT_START), []);

  useEffect(() => {
    finalColor.set(palette.background.neon);
  }, [palette.background.neon, finalColor]);

  useEffect(() => {
    scene.background = scratchColor;
    return () => {
      scene.background = null;
    };
  }, [scene, scratchColor]);

  useFrame(() => {
    const progress = useSceneStore.getState().controllerValue;
    const { finalMix, holdMix } = getSceneColorMix(progress);
    scratchColor.copy(startColor).lerp(holdColor, holdMix).lerp(finalColor, finalMix);
  });

  return null;
}

export function LandingScene() {
  return (
    <>
      <SceneBackground />
      <SceneRig>
        <BlueprintFloor />
        <Fireflies />
        <HeadlineParticles />
        <TelemetryPanels />
      </SceneRig>
      <ContactLinks />
      <AnalogOverlay />
      <AnalogPostChain />
    </>
  );
}
