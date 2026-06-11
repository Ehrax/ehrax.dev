// EXPERIMENT — kept hero exploration (Nebula Bloom, fable): "Nebula Bloom" — slow-drifting folded nebula of curl-displaced particles, indigo→violet→gold ramp, star specks, bloom.
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { curlNoiseChunk } from "~/scene/shaders/curlNoise";

// ---- tuning dials ----
const PARTICLE_COUNT = 18000;
const SPECK_COUNT = 300;
const SHELL_RADII = [0.55, 0.95, 1.35, 1.8];
const WARP_AMPLITUDE = 0.55; // CPU domain-warp fold strength
const DRIFT_SPEED = 0.15; // meditative
const CURL_FREQ = 0.9;
const CURL_AMPLITUDE = 0.28;
const CENTER_X = 0.9; // slightly right of screen center
const POINT_SIZE = 9.0;
const REDUCED_MOTION_TIME = 42.0; // frozen frame seed
const CORE_BOOST = 1.6; // >1.0 so bloom picks the gold core

const nebulaVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
varying vec3 vColor;
${curlNoiseChunk}
void main(){
  float t = uTime * ${DRIFT_SPEED.toFixed(3)};
  vec3 p = position;
  // 2-octave curl displacement, quiet second octave for premium calm
  vec3 c1 = curlNoise(p * ${CURL_FREQ.toFixed(2)} + t);
  vec3 c2 = curlNoise(p * ${(CURL_FREQ * 2.3).toFixed(2)} - t * 0.7 + 11.3);
  // region-varying wispiness so it folds rather than fuzzes
  float region = snoise(p * 0.6 + t * 0.4) * 0.5 + 0.5;
  p += (c1 * ${CURL_AMPLITUDE.toFixed(3)} + c2 * ${(CURL_AMPLITUDE * 0.4).toFixed(3)}) * (0.35 + 0.65 * region);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = ${POINT_SIZE.toFixed(1)} * aScale * uPixelRatio * (1.0 / -mv.z);
  vColor = color;
}
`;

const nebulaFragment = /* glsl */ `
varying vec3 vColor;
void main(){
  float d = distance(gl_PointCoord, vec2(0.5));
  if (d > 0.5) discard;
  float strength = pow(1.0 - d * 2.0, 4.0);
  gl_FragColor = vec4(vColor * strength, 1.0);
}
`;

const speckVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
attribute float aPhase;
varying float vTwinkle;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vTwinkle = 0.55 + 0.45 * sin(uTime * 1.7 + aPhase);
  gl_PointSize = 16.0 * aScale * uPixelRatio * (0.6 + 0.4 * vTwinkle) * (1.0 / -mv.z);
}
`;

const speckFragment = /* glsl */ `
varying float vTwinkle;
void main(){
  float d = distance(gl_PointCoord, vec2(0.5));
  if (d > 0.5) discard;
  float strength = pow(1.0 - d * 2.0, 3.0);
  vec3 col = vec3(1.4, 1.3, 1.6) * strength * vTwinkle;
  gl_FragColor = vec4(col, 1.0);
}
`;

// CPU-side value noise + fbm for one-time domain warping of seed positions.
function hash3(x: number, y: number, z: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function valueNoise(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const w = zf * zf * (3 - 2 * zf);
  let acc = 0;
  for (let dx = 0; dx <= 1; dx++) {
    for (let dy = 0; dy <= 1; dy++) {
      for (let dz = 0; dz <= 1; dz++) {
        const weight = (dx ? u : 1 - u) * (dy ? v : 1 - v) * (dz ? w : 1 - w);
        acc += hash3(xi + dx, yi + dy, zi + dz) * weight;
      }
    }
  }
  return acc * 2 - 1;
}
function fbm(x: number, y: number, z: number): number {
  return valueNoise(x, y, z) + 0.5 * valueNoise(x * 2.1, y * 2.1, z * 2.1);
}

interface NebulaBuffers {
  positions: Float32Array;
  colors: Float32Array;
  scales: Float32Array;
}

function buildNebula(): NebulaBuffers {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const scales = new Float32Array(PARTICLE_COUNT);
  const gold = new THREE.Color("#ffcc66");
  const violet = new THREE.Color("#7a4fd0");
  const indigo = new THREE.Color("#1b2a84");
  const c = new THREE.Color();
  const maxRadius = SHELL_RADII[SHELL_RADII.length - 1] ?? 1.8;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const perShell = Math.floor(PARTICLE_COUNT / SHELL_RADII.length);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const shell = Math.min(Math.floor(i / perShell), SHELL_RADII.length - 1);
    const r = (SHELL_RADII[shell] ?? maxRadius) * (0.92 + 0.16 * hash3(i, 7.3, 1.1));
    const k = i % perShell;
    const y = 1 - (k / Math.max(perShell - 1, 1)) * 2;
    const ringR = Math.sqrt(Math.max(1 - y * y, 0));
    const theta = golden * k + shell * 1.7;
    let px = Math.cos(theta) * ringR * r;
    let py = y * r;
    let pz = Math.sin(theta) * ringR * r;

    // double domain warp (IQ): q = fbm(p), then warp by fbm(p + 2q)
    const qx = fbm(px * 0.8, py * 0.8, pz * 0.8);
    const qy = fbm(px * 0.8 + 5.2, py * 0.8 + 1.3, pz * 0.8 + 2.8);
    const qz = fbm(px * 0.8 + 9.1, py * 0.8 + 4.7, pz * 0.8 + 6.4);
    px += WARP_AMPLITUDE * fbm(px + 2.0 * qx, py + 2.0 * qy, pz + 2.0 * qz);
    py += WARP_AMPLITUDE * fbm(px + 2.0 * qy + 3.1, py + 2.0 * qz, pz + 2.0 * qx);
    pz += WARP_AMPLITUDE * fbm(px + 2.0 * qz + 7.7, py + 2.0 * qx, pz + 2.0 * qy);

    positions[i * 3] = px;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = pz;

    const radius = Math.sqrt(px * px + py * py + pz * pz);
    const t = Math.min(radius / maxRadius, 1);
    if (t < 0.5) {
      c.copy(gold).lerp(violet, t * 2);
    } else {
      c.copy(violet).lerp(indigo, (t - 0.5) * 2);
    }
    const boost = t < 0.35 ? CORE_BOOST : 1.0; // gold core crosses bloom threshold
    colors[i * 3] = c.r * boost;
    colors[i * 3 + 1] = c.g * boost;
    colors[i * 3 + 2] = c.b * boost;
    scales[i] = 0.5 + hash3(i, 3.7, 9.2);
  }
  return { positions, colors, scales };
}

interface SpeckBuffers {
  positions: Float32Array;
  scales: Float32Array;
  phases: Float32Array;
}

function buildSpecks(): SpeckBuffers {
  const positions = new Float32Array(SPECK_COUNT * 3);
  const scales = new Float32Array(SPECK_COUNT);
  const phases = new Float32Array(SPECK_COUNT);
  for (let i = 0; i < SPECK_COUNT; i++) {
    const u = hash3(i, 1.1, 2.2) * 2 - 1;
    const phi = hash3(i, 4.4, 5.5) * Math.PI * 2;
    const r = 1.2 + 2.6 * hash3(i, 8.8, 0.3);
    const ringR = Math.sqrt(Math.max(1 - u * u, 0));
    positions[i * 3] = Math.cos(phi) * ringR * r;
    positions[i * 3 + 1] = u * r;
    positions[i * 3 + 2] = Math.sin(phi) * ringR * r - 0.5;
    scales[i] = 0.4 + hash3(i, 6.6, 7.7) * 0.9;
    phases[i] = hash3(i, 2.9, 3.3) * Math.PI * 2;
  }
  return { positions, scales, phases };
}

export function NebulaBloomHero() {
  const nebula = useMemo(buildNebula, []);
  const specks = useMemo(buildSpecks, []);
  const reducedRef = useRef(false);

  const nebulaUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);
  const speckUniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), []);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) {
      nebulaUniforms.uTime.value = REDUCED_MOTION_TIME;
      speckUniforms.uTime.value = REDUCED_MOTION_TIME;
    }
  }, [nebulaUniforms, speckUniforms]);

  useFrame((state) => {
    const sizeFactor = state.gl.getPixelRatio() * state.size.height * 0.5;
    nebulaUniforms.uPixelRatio.value = sizeFactor;
    speckUniforms.uPixelRatio.value = sizeFactor;
    if (reducedRef.current) return;
    const t = state.clock.elapsedTime;
    nebulaUniforms.uTime.value = t;
    speckUniforms.uTime.value = t;
  });

  return (
    <>
      <color attach="background" args={["#05050d"]} />
      <group position={[CENTER_X, 0, 0]}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nebula.positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[nebula.colors, 3]} />
            <bufferAttribute attach="attributes-aScale" args={[nebula.scales, 1]} />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={nebulaVertex}
            fragmentShader={nebulaFragment}
            uniforms={nebulaUniforms}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={false}
            transparent
            vertexColors
            toneMapped={false}
          />
        </points>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[specks.positions, 3]} />
            <bufferAttribute attach="attributes-aScale" args={[specks.scales, 1]} />
            <bufferAttribute attach="attributes-aPhase" args={[specks.phases, 1]} />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={speckVertex}
            fragmentShader={speckFragment}
            uniforms={speckUniforms}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={false}
            transparent
            toneMapped={false}
          />
        </points>
      </group>
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.3}
          radius={0.85}
        />
        <Vignette offset={0.35} darkness={0.6} />
        <Noise premultiply opacity={0.04} />
      </EffectComposer>
    </>
  );
}
