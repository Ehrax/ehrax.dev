// Fireflies — sparse glowing motes drifting above the drafting floor.
// Prop-free: scroll state is read inside useFrame via useSceneStore.getState().
// Geometry is built once; all drift lives in the vertex shader.
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type ShaderMaterial } from "three";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import {
  FIREFLY_COUNT,
  nameFadeOpacity,
  PARTICLE_ACCENT_COOL,
  PARTICLE_ACCENT_WARM,
} from "~/scene/scenes/landingTuning";
import { getFloorEffectOpacity } from "~/scene/sceneTransition";
import { firefliesFragmentShader, firefliesVertexShader } from "~/scene/shaders/fireflies";
import { useSceneStore } from "~/state/sceneStore";

function buildFireflies(count: number) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // Scatter over the visible table, biased upward so they float over the
    // grid rather than sitting in it; pushed off-center so they frame the
    // wordmark instead of crowding it.
    const x = (Math.random() - 0.5) * 18;
    positions[i * 3] = Math.abs(x) < 2.5 ? x + Math.sign(x || 1) * 2.5 : x;
    positions[i * 3 + 1] = -0.6 + Math.random() * 3.2;
    positions[i * 3 + 2] = -5 + Math.random() * 8;
    seeds[i] = Math.random();
    sizes[i] = 36 + Math.random() * 64;
  }
  return { positions, seeds, sizes };
}

export function Fireflies() {
  const materialRef = useRef<ShaderMaterial>(null);
  const timeRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const dpr = useThree((state) => state.viewport.dpr);

  const flies = useMemo(() => buildFireflies(FIREFLY_COUNT), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
      uColorCool: { value: PARTICLE_ACCENT_COOL.clone() },
      uColorWarm: { value: PARTICLE_ACCENT_WARM.clone() },
    }),
    [],
  );

  useFrame((_, delta) => {
    // Reduced motion: fireflies hold still and glow steadily.
    if (!reducedMotion) timeRef.current += delta;
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = timeRef.current;
    u.uPixelRatio.value = dpr;
    // Embers over the hero floor, gone through the content sections, then back
    // for the contact finale on the same fade window as the invitation.
    const sceneState = useSceneStore.getState();
    u.uOpacity.value = Math.max(
      getFloorEffectOpacity(sceneState.controllerValue),
      nameFadeOpacity(sceneState.contactProgress) * 0.85,
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[flies.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[flies.seeds, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[flies.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        vertexShader={firefliesVertexShader}
        fragmentShader={firefliesFragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
}
