// Screen-space analog grain overlay — coarse animated grain, faint scanlines
// and a periodic top→bottom TV sweep line, drawn as a fullscreen clip-space
// quad on top of the scene (renderOrder last, no depth).
// Prop-free: scroll state is read inside useFrame via useSceneStore.getState().
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { ShaderMaterial } from "three";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import { nameFadeOpacity } from "~/scene/scenes/landingTuning";
import { getSceneEffectOpacity } from "~/scene/sceneTransition";
import {
  analogOverlayFragmentShader,
  analogOverlayVertexShader,
} from "~/scene/shaders/analogOverlay";
import { useSceneStore } from "~/state/sceneStore";

export function AnalogOverlay() {
  const materialRef = useRef<ShaderMaterial>(null);
  const timeRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!reducedMotion) timeRef.current += delta;
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = timeRef.current;

    // Full strength over the hero, silent through the content sections, then
    // back with the contact finale: grain and the sweep lines close the page
    // out on the same fade window as the invitation.
    const sceneState = useSceneStore.getState();
    const effectOpacity = Math.max(
      getSceneEffectOpacity(sceneState.controllerValue),
      nameFadeOpacity(sceneState.contactProgress),
    );
    // Reduced motion: keep a whisper of static grain, drop the sweep flicker.
    materialRef.current.uniforms.uOpacity.value = reducedMotion
      ? 0.3 * effectOpacity
      : effectOpacity;
  });

  return (
    <mesh renderOrder={1000} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest={false}
        vertexShader={analogOverlayVertexShader}
        fragmentShader={analogOverlayFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
