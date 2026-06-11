// EXPERIMENT — kept hero exploration (Analog Field, sonnet): Analog Field — techno generative structure with Kodak Gold 200 film soul

import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ─── Tuning dials ────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 18000; // total particles (≤20k budget)
const ROTATION_SPEED = 0.025; // rad/s main disc rotation
const PREC_SPEED = 0.009; // rad/s precession axis wobble
// jitter amp=0.08 and freq=0.55 are inlined in VERTEX_SHADER as GLSL literals
const FLARE_FRAC = 0.03; // fraction of amber "dust-on-film" flare particles
const BLOOM_INTENSITY = 0.9;
const BLOOM_THRESHOLD = 0.45;
const VIGNETTE_DARKNESS = 0.75;
const NOISE_OPACITY = 0.065; // film grain (higher than default for Kodak feel)
// ─────────────────────────────────────────────────────────────────────────────

// Simplex-ish noise helpers inlined in vertex shader (Perlin 3D via hash)
const VERTEX_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uRotation;
uniform float uPrecession;
uniform float uSize;
attribute float aRadius;
attribute float aAngle;
attribute float aZOffset;
attribute float aSeed;
attribute float aFlare;
attribute vec3  aColor;
varying   vec3  vColor;

vec3 hash3(vec3 p) {
  p = fract(p * vec3(443.8975, 397.2973, 491.1871));
  p += dot(p.zxy, p.yxz + 19.19);
  return fract(vec3(p.x * p.y, p.y * p.z, p.z * p.x) * 46.1);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = dot(hash3(i + vec3(0,0,0)) * 2.0 - 1.0, f - vec3(0,0,0));
  float n100 = dot(hash3(i + vec3(1,0,0)) * 2.0 - 1.0, f - vec3(1,0,0));
  float n010 = dot(hash3(i + vec3(0,1,0)) * 2.0 - 1.0, f - vec3(0,1,0));
  float n110 = dot(hash3(i + vec3(1,1,0)) * 2.0 - 1.0, f - vec3(1,1,0));
  float n001 = dot(hash3(i + vec3(0,0,1)) * 2.0 - 1.0, f - vec3(0,0,1));
  float n101 = dot(hash3(i + vec3(1,0,1)) * 2.0 - 1.0, f - vec3(1,0,1));
  float n011 = dot(hash3(i + vec3(0,1,1)) * 2.0 - 1.0, f - vec3(0,1,1));
  float n111 = dot(hash3(i + vec3(1,1,1)) * 2.0 - 1.0, f - vec3(1,1,1));
  return mix(
    mix(mix(n000,n100,u.x), mix(n010,n110,u.x), u.y),
    mix(mix(n001,n101,u.x), mix(n011,n111,u.x), u.y),
    u.z
  );
}

void main() {
  float ang = aAngle + uRotation;
  float tilt = sin(uPrecession) * 0.28;
  float cx = cos(ang);
  float sx = sin(ang);

  vec3 pos = vec3(
    aRadius * cx,
    aRadius * sx * sin(tilt) + aZOffset * cos(tilt),
    aRadius * sx * cos(tilt) - aZOffset * sin(tilt)
  );

  float t = uTime * 0.18;
  vec3 noiseIn = pos * 0.55 + vec3(aSeed * 13.7, aSeed * 7.3, t + aSeed);
  float nx = noise3(noiseIn);
  float ny = noise3(noiseIn + vec3(5.2, 1.3, 0.0));
  float nz = noise3(noiseIn + vec3(0.0, 2.8, 9.1));
  pos += vec3(nx, ny, nz) * 0.08;

  float flareBoost = aFlare > 0.5 ? (1.0 + 1.2 * abs(sin(uTime * 1.1 + aSeed * 6.28))) : 1.0;
  vColor = aColor * flareBoost;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float baseSize = uSize * (0.7 + 0.6 * aSeed) * (aFlare > 0.5 ? 1.8 : 1.0);
  gl_PointSize = baseSize * (1.0 / -mv.z);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
precision highp float;
varying vec3 vColor;

float bayer(vec2 fc) {
  mat4 m = mat4(
     0., 8., 2.,10.,
    12., 4.,14., 6.,
     3.,11., 1., 9.,
    15., 7.,13., 5.
  ) / 16.0;
  ivec2 p = ivec2(mod(fc, 4.0));
  return m[p.y][p.x] - 0.5;
}

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float d = length(coord);
  if (d > 0.5) discard;

  float strength = pow(1.0 - d * 2.0, 4.5);
  vec3 col = vColor * strength;
  col += bayer(gl_FragCoord.xy) * (1.5 / 255.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

function buildGeometry(count: number): THREE.BufferGeometry {
  const radii = new Float32Array(count);
  const angles = new Float32Array(count);
  const zOffsets = new Float32Array(count);
  const seeds = new Float32Array(count);
  const flares = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  // Kodak Gold 200 palette — scaled to keep base ≈0.85 so bloom is selective
  const warmCream = new THREE.Color(0.77, 0.66, 0.41);
  const dimGold = new THREE.Color(0.55, 0.44, 0.22);
  const mauveAccnt = new THREE.Color(0.62, 0.46, 0.34);
  const amberFlare = new THREE.Color(1.7, 0.78, 0.24); // > 1 → bloom selective

  const PHI = (1 + Math.sqrt(5)) / 2;
  const flareThresh = 1 - FLARE_FRAC;

  for (let i = 0; i < count; i++) {
    const rng = (i * 0.6180339887 + 0.1) % 1.0;
    const rng2 = (i * 1.3247) % 1.0;
    const rng3 = (i * 0.7549) % 1.0;

    const layer = i % 3;
    let r: number, a: number, z: number;

    if (layer === 0) {
      // Phyllotaxis spiral disc
      const frac = i / count;
      r = Math.sqrt(frac) * 2.6;
      a = i * ((2 * Math.PI) / (PHI * PHI));
      z = (rng - 0.5) * 0.12;
    } else if (layer === 1) {
      // Concentric ring lattice
      const ringIdx = Math.floor(rng * 5);
      const ringR = [0.4, 0.85, 1.35, 1.9, 2.5][ringIdx];
      r = ringR + (rng2 - 0.5) * 0.08;
      a = rng3 * 2 * Math.PI;
      z = (rng - 0.5) * 0.05;
    } else {
      // Sparse 3D scatter — floating field dust
      r = rng * 3.1;
      a = rng2 * 2 * Math.PI;
      z = (rng3 - 0.5) * 0.9;
    }

    radii[i] = r;
    angles[i] = a;
    zOffsets[i] = z;
    seeds[i] = rng;

    const isFlare = rng > flareThresh;
    flares[i] = isFlare ? 1.0 : 0.0;

    let c: THREE.Color;
    if (isFlare) {
      c = amberFlare.clone();
    } else if (r < 0.6) {
      c = warmCream.clone().lerp(amberFlare, 0.25);
    } else if (r < 1.6) {
      c = warmCream.clone().lerp(dimGold, (r - 0.6) / 1.0);
    } else {
      c = dimGold.clone().lerp(mauveAccnt, Math.min((r - 1.6) / 1.5, 1.0));
    }

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
  geo.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));
  geo.setAttribute("aZOffset", new THREE.BufferAttribute(zOffsets, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute("aFlare", new THREE.BufferAttribute(flares, 1));
  geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  // Dummy position attribute — positions are computed entirely in vertex shader
  const pos = new Float32Array(count * 3);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return geo;
}

export function AnalogFieldHero() {
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const rotRef = useRef(0);
  const precRef = useRef(0);

  const geo = useMemo(() => buildGeometry(PARTICLE_COUNT), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRotation: { value: 0 },
      uPrecession: { value: 0 },
      uSize: { value: 55 },
    }),
    [],
  );

  useFrame((_state, delta) => {
    if (reducedMotion) return;
    rotRef.current += delta * ROTATION_SPEED;
    precRef.current += delta * PREC_SPEED;
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uRotation.value = rotRef.current;
    mat.uniforms.uPrecession.value = precRef.current;
  });

  return (
    <>
      {/* Warm charcoal — lifted film-scan black, not pure black */}
      <color attach="background" args={["#1a1710"]} />

      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          transparent={true}
          toneMapped={false}
        />
      </points>

      {/* Analog film post chain — warm bloom, strong vignette, high grain */}
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={BLOOM_INTENSITY}
          luminanceThreshold={BLOOM_THRESHOLD}
          luminanceSmoothing={0.4}
          radius={0.9}
          levels={7}
        />
        <Vignette offset={0.28} darkness={VIGNETTE_DARKNESS} />
        <Noise premultiply opacity={NOISE_OPACITY} />
      </EffectComposer>
    </>
  );
}
