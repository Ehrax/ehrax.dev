// Blueprint drafting floor — the tilted grid/circles/crosshair plane, plus
// the dancefloor lamp manager: up to LAMP_COUNT lamps live under the glass,
// each running an ignite-flicker → hold → exponential-decay envelope before
// respawning at another cell. Lamp state lives in refs and uniforms only.
// Prop-free: scroll state is read inside useFrame via useSceneStore.getState().
// No per-frame allocations; uniforms are built once in useMemo.
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { type Mesh, type ShaderMaterial, Vector4 } from "three";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import {
  CELL_GLOW_COLORS,
  ENTRANCE_SECONDS,
  FLOOR_POSITION,
  FLOOR_ROLL_Z,
  FLOOR_SIZE,
  FLOOR_TILT,
  GRID_LINE_COLOR,
  LAMP_COUNT,
  LAMP_FIELD,
} from "~/scene/scenes/landingTuning";
import { getFloorEffectOpacity } from "~/scene/sceneTransition";
import {
  blueprintFloorFragmentShader,
  blueprintFloorVertexShader,
} from "~/scene/shaders/blueprintFloor";
import { useSceneStore } from "~/state/sceneStore";

// Per-lamp lifecycle phase durations in seconds. "gap" is the dark time
// before the lamp respawns somewhere else.
const IGNITE = 0.5;
const HOLD = 1.6;
const DECAY = 2.2;

type Lamp = {
  t: number; // seconds into the current cycle (starts negative during gap)
  colorIndex: number;
};

function respawnLamp(lamp: Lamp, lampUniform: Vector4, first: boolean) {
  // Park the lamp on a cell center inside the clearly-visible field.
  lampUniform.x = Math.floor((Math.random() - 0.5) * LAMP_FIELD[0]) + 0.5;
  lampUniform.y = Math.floor((Math.random() - 0.5) * LAMP_FIELD[1]) + 0.5;
  lampUniform.w = 0;
  lamp.colorIndex = Math.floor(Math.random() * CELL_GLOW_COLORS.length);
  // Negative time = waiting in the dark. Stagger first spawns hard so the
  // lamps never pulse in sync.
  lamp.t = -(first ? Math.random() * 8 : 2 + Math.random() * 6);
}

// Envelope: glitchy ignition stutter → steady hold → slow exponential decay.
function lampIntensity(lamp: Lamp, t: number): number {
  if (t < 0) return 0;
  if (t < IGNITE) {
    const ramp = t / IGNITE;
    const stutter = Math.sin(t * 53 + lamp.colorIndex * 7) > -0.2 ? 1 : 0.15;
    return ramp * stutter;
  }
  if (t < IGNITE + HOLD) return 1;
  return Math.exp(-3 * (t - IGNITE - HOLD));
}

export function BlueprintFloor() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const timeRef = useRef(0);
  const revealRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const lampsRef = useRef<Lamp[]>(
    Array.from({ length: LAMP_COUNT }, () => ({ t: 0, colorIndex: 0 })),
  );

  const uniforms = useMemo(() => {
    const lampUniforms = Array.from({ length: LAMP_COUNT }, () => new Vector4(0, 0, 0, 0));
    const lampColors = Array.from({ length: LAMP_COUNT }, () => CELL_GLOW_COLORS[0].clone());
    lampsRef.current.forEach((lamp, i) => {
      respawnLamp(lamp, lampUniforms[i], true);
      lampColors[i].copy(CELL_GLOW_COLORS[lamp.colorIndex]);
    });
    return {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uReveal: { value: 0 },
      uFlicker: { value: 0 },
      uSize: { value: FLOOR_SIZE },
      uLineColor: { value: GRID_LINE_COLOR.clone() },
      uLamps: { value: lampUniforms },
      uLampColors: { value: lampColors },
    };
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion) timeRef.current += delta;
    // Roll-out: the grid draws outward from the center during the entrance.
    revealRef.current = reducedMotion
      ? 1
      : Math.min(1, revealRef.current + delta / (ENTRANCE_SECONDS * 0.8));

    const progress = useSceneStore.getState().controllerValue;
    const effectOpacity = getFloorEffectOpacity(progress);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uOpacity.value = effectOpacity;
      materialRef.current.uniforms.uReveal.value = revealRef.current;
      // Neon flicker and trace packets are motion — off under reduced motion,
      // and held back until the grid has finished drawing itself.
      materialRef.current.uniforms.uFlicker.value = reducedMotion
        ? 0
        : Math.min(1, Math.max(0, revealRef.current * 2 - 1));

      // Advance the lamp lifecycles, mutating uniforms in place.
      if (!reducedMotion) {
        const lampUniforms = materialRef.current.uniforms.uLamps.value as Vector4[];
        const lampColors = materialRef.current.uniforms.uLampColors.value;
        for (let i = 0; i < LAMP_COUNT; i++) {
          const lamp = lampsRef.current[i];
          lamp.t += delta;
          if (lamp.t > IGNITE + HOLD + DECAY + 1) {
            respawnLamp(lamp, lampUniforms[i], false);
            lampColors[i].copy(CELL_GLOW_COLORS[lamp.colorIndex]);
          }
          lampUniforms[i].w = lampIntensity(lamp, lamp.t);
        }
      }
    }
    // Idle breathing only — the entrance book-roll and scroll roll live on the
    // shared SceneRig so floor and wordmark move as one.
    if (meshRef.current) {
      meshRef.current.rotation.x = FLOOR_TILT + Math.sin(timeRef.current * 0.11) * 0.014;
      meshRef.current.position.y = FLOOR_POSITION[1] + Math.sin(timeRef.current * 0.17) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[FLOOR_TILT, 0, FLOOR_ROLL_Z]} position={FLOOR_POSITION}>
      <planeGeometry args={FLOOR_SIZE} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        vertexShader={blueprintFloorVertexShader}
        fragmentShader={blueprintFloorFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
