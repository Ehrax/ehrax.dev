// Particle wordmark and the hero performance chain: "welcome." morphs through
// phyllotaxis sphere → Aizawa attractor → torus knot as the user scrolls,
// then fades before About; at the very end the particles return as the name.
// Prop-free: scroll state is read inside useFrame via useSceneStore.getState().
// Geometry rebuilds only when viewport.width changes (useMemo key).
// No per-frame allocations; uniforms are built once in useMemo.
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Group, type ShaderMaterial } from "three";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import {
  bookRoll,
  CHAIN_SMOOTH_SECONDS,
  chainProgress,
  ENTRANCE_SECONDS,
  FLOOR_ROLL_Z,
  GLITCH_BURST_SECONDS,
  GLITCH_GAP_JITTER_SECONDS,
  GLITCH_MIN_GAP_SECONDS,
  nameFadeOpacity,
  nameMorphProgress,
  NAV_REVEAL_SECONDS,
  PARTICLE_ACCENT_COOL,
  PARTICLE_ACCENT_WARM,
  PARTICLE_CORE,
  PARTICLE_TINT,
  TEXT_TILT,
  textHalfWidth,
} from "~/scene/scenes/landingTuning";
import { getSceneEffectOpacity } from "~/scene/sceneTransition";
import {
  headlineParticlesFragmentShader,
  headlineParticlesVertexShader,
} from "~/scene/shaders/headlineParticles";
import { useSceneStore } from "~/state/sceneStore";
import { sampleHeadline } from "./headlineSampling";

export function HeadlineParticles() {
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const timeRef = useRef(0);
  const progressRef = useRef(0);
  // Corruption burst clock: counts down to the next burst, then runs the burst
  // envelope. First burst waits for the entrance to fully settle.
  const glitchNextRef = useRef(ENTRANCE_SECONDS + GLITCH_MIN_GAP_SECONDS);
  const glitchAtRef = useRef(-1);
  const chainRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const viewport = useThree((state) => state.viewport);
  const dpr = useThree((state) => state.viewport.dpr);

  const headline = useMemo(() => sampleHeadline(viewport.width), [viewport.width]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uChain: { value: 0 },
      uNameMorph: { value: 0 },
      uGlitch: { value: 0 },
      uHalfWidth: { value: 1 },
      uColorCore: { value: PARTICLE_CORE.clone() },
      uColorTint: { value: PARTICLE_TINT.clone() },
      uColorCool: { value: PARTICLE_ACCENT_COOL.clone() },
      uColorWarm: { value: PARTICLE_ACCENT_WARM.clone() },
    }),
    [],
  );

  useFrame((_, delta) => {
    // Reduced motion: freeze at a settled, beautiful frame instead of removing.
    if (!reducedMotion) timeRef.current += delta;
    progressRef.current = reducedMotion
      ? 1
      : Math.min(1, progressRef.current + delta / ENTRANCE_SECONDS);

    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value = timeRef.current;
    u.uProgress.value = progressRef.current;
    u.uPixelRatio.value = dpr;

    const sceneState = useSceneStore.getState();
    // Nav chrome enters a beat after the wordmark settles (immediately under
    // reduced motion, where the entrance snaps to its settled frame).
    if (!sceneState.navRevealed && (reducedMotion || timeRef.current >= NAV_REVEAL_SECONDS)) {
      sceneState.revealNav();
    }
    const scrollProgress = sceneState.controllerValue;
    u.uHalfWidth.value = textHalfWidth(viewport.width);

    // The performance chain is scrubbed by raw document scroll (the controller
    // ramps too fast over the early hero); per-particle stagger lives in the
    // shader. The scrubbed value is only the TARGET: the rendered chain chases
    // it on a time constant, so flick-scrolling still plays each morph as a
    // watchable flight through every intermediate form. Reduced motion snaps
    // between settled forms instead of animating the flight.
    const chainTarget = chainProgress(sceneState.scrollProgress);
    chainRef.current = reducedMotion
      ? Math.round(chainTarget)
      : chainRef.current +
        (chainTarget - chainRef.current) * (1 - Math.exp(-delta / CHAIN_SMOOTH_SECONDS));
    const chain = chainRef.current;
    u.uChain.value = chain;

    // Finale: as the Contact section arrives the particles return from the
    // fade and resolve into the name; scrolling back up unwinds it. Driven by
    // contact progress — see the NAME_* constants for why not document scroll.
    const nameMorph = reducedMotion
      ? Math.round(nameMorphProgress(sceneState.contactProgress))
      : nameMorphProgress(sceneState.contactProgress);
    u.uNameMorph.value = nameMorph;
    u.uOpacity.value = Math.max(
      getSceneEffectOpacity(scrollProgress),
      nameFadeOpacity(sceneState.contactProgress),
    );

    // Corruption bursts: fire on a randomized clock, never under reduced
    // motion. The envelope tears in fast and reassembles slowly.
    if (!reducedMotion && timeRef.current >= glitchNextRef.current) {
      glitchAtRef.current = timeRef.current;
      glitchNextRef.current =
        timeRef.current + GLITCH_MIN_GAP_SECONDS + Math.random() * GLITCH_GAP_JITTER_SECONDS;
    }
    const sinceGlitch = timeRef.current - glitchAtRef.current;
    const burst =
      glitchAtRef.current >= 0 && sinceGlitch < GLITCH_BURST_SECONDS
        ? Math.sin((sinceGlitch / GLITCH_BURST_SECONDS) ** 0.6 * Math.PI)
        : 0;
    u.uGlitch.value = burst;

    // The wordmark stands up out of the table tilt and floats toward the
    // viewport center as it becomes the first form; the lift is driven by the
    // first chain leg so the forms hover centered above the drafting floor.
    if (groupRef.current) {
      const lift = Math.min(1, chain);
      const roll = bookRoll(scrollProgress);
      groupRef.current.rotation.x = TEXT_TILT * (1 - lift) + roll * 0.8 * lift;
      // The finale type stands up straight: the drafting-table diagonal roll
      // eases out and the group pulls back so the name sits centered and
      // legible rather than looming at form distance.
      groupRef.current.rotation.z = FLOOR_ROLL_Z * (1 - nameMorph);
      // The invitation lifts just above centre so the email line and the link
      // buttons stack beneath it as one tight centred cluster.
      groupRef.current.position.y = 0.1 + (0.15 + roll * 1.6) * lift + nameMorph * 0.7;
      groupRef.current.position.z = roll * 1.2 * lift - nameMorph * 1.6;
    }
  });

  return (
    // Laid into the drafting table: shares the floor's diagonal roll and most
    // of its tilt, lifted slightly above the grid plane.
    <group ref={groupRef} rotation={[TEXT_TILT, 0, FLOOR_ROLL_Z]} position={[0, 0.1, 0]}>
      <points key={headline.targets.length}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[headline.targets, 3]} />
          <bufferAttribute attach="attributes-aLattice" args={[headline.lattices, 3]} />
          <bufferAttribute attach="attributes-aAttractor" args={[headline.attractors, 3]} />
          <bufferAttribute attach="attributes-aKnot" args={[headline.knots, 3]} />
          <bufferAttribute attach="attributes-aFibration" args={[headline.fibrations, 3]} />
          <bufferAttribute attach="attributes-aName" args={[headline.names, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[headline.seeds, 1]} />
          <bufferAttribute attach="attributes-aDelay" args={[headline.delays, 1]} />
          <bufferAttribute attach="attributes-aSize" args={[headline.sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          vertexShader={headlineParticlesVertexShader}
          fragmentShader={headlineParticlesFragmentShader}
          uniforms={uniforms}
        />
      </points>
    </group>
  );
}
