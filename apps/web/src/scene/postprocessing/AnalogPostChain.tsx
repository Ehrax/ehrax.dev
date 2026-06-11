// Analog camera treatment: bloom, chromatic aberration, vignette, film grain,
// and VHS glitch bands. All scroll-driven intensity is pushed into effect
// uniforms/properties from a single useFrame — effects are never recreated.
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import type { ChromaticAberrationEffect, NoiseEffect, VignetteEffect } from "postprocessing";
import { useMemo, useRef } from "react";
import { Vector2 } from "three";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import { nameFadeOpacity } from "~/scene/scenes/landingTuning";
import { getSceneEffectOpacity } from "~/scene/sceneTransition";
import { useSceneStore } from "~/state/sceneStore";
import { GlitchBandEffect } from "./GlitchBandEffect";

export function AnalogPostChain() {
  const chromaticRef = useRef<ChromaticAberrationEffect>(null);
  const vignetteRef = useRef<VignetteEffect>(null);
  const noiseRef = useRef<NoiseEffect>(null);

  const glitchBand = useMemo(() => new GlitchBandEffect(), []);
  // Must be a real Vector2: the wrapper assigns this prop straight through the
  // effect's `offset` setter, and the useFrame below mutates it via .set().
  const chromaticOffset = useMemo(() => new Vector2(0.0006, 0.0006), []);
  const reducedMotion = usePrefersReducedMotion();

  useFrame(() => {
    const sceneState = useSceneStore.getState();
    const heroO = getSceneEffectOpacity(sceneState.controllerValue);
    // The analog character (drift bands, noise, fringe) returns with the
    // contact finale; the vignette stays hero-only — corner darkening would
    // fight the seamless background hand-off into the footer.
    const o = Math.max(heroO, nameFadeOpacity(sceneState.contactProgress));

    if (chromaticRef.current) {
      // .offset is a Vector2; set() mutates in place — no allocation.
      const v = 0.0006 * o;
      chromaticRef.current.offset.set(v, v);
    }

    if (vignetteRef.current) {
      vignetteRef.current.darkness = 0.62 * heroO;
    }

    if (noiseRef.current) {
      noiseRef.current.blendMode.opacity.value = reducedMotion ? 0 : 0.1 * o;
    }

    glitchBand.setStrength(reducedMotion ? 0 : 0.018 * o);
  });

  return (
    <EffectComposer multisampling={0}>
      {/* Bloom intensity stays constant — its input (particles/grid) already
          fades with effectOpacity; changing the prop would rebuild the mipmap
          render targets on every scroll frame. */}
      <Bloom
        mipmapBlur
        intensity={0.85}
        luminanceThreshold={0.45}
        luminanceSmoothing={0.35}
        radius={0.85}
      />
      <ChromaticAberration
        ref={chromaticRef}
        offset={chromaticOffset}
        radialModulation
        modulationOffset={0.4}
      />
      <Vignette ref={vignetteRef} offset={0.25} darkness={0.62} />
      <Noise ref={noiseRef} premultiply opacity={0.1} />
      <primitive object={glitchBand} />
    </EffectComposer>
  );
}
