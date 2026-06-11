// Headline particles: galaxy spiral entrance + the scroll-scrubbed chain of
// forms (wordmark → phyllotaxis sphere → Aizawa attractor → torus knot) plus
// the name finale.
//
// Vertex uniforms
//   uTime       float  — elapsed seconds
//   uProgress   float  — entrance progress 0→1
//   uPixelRatio float  — window.devicePixelRatio
//   uHalfWidth  float  — half the text bounding box width (world units)
//   uChain      float  — chain position 0..4 (0 wordmark, 1 lattice, 2 attractor, 3 knot, 4 fibration)
//   uNameMorph  float  — finale: 0..1 blend into the name glyphs
//   uGlitch     float  — corruption-burst envelope
//
// Vertex attributes
//   aLattice    vec3   — home on the phyllotaxis sphere (form A)
//   aAttractor  vec3   — home on the Aizawa trajectory (form B)
//   aKnot       vec3   — home on the torus-knot tube (form C)
//   aFibration  vec3   — home on the Hopf-fibration circles (form D)
//   aName       vec3   — home in the name glyphs (finale)
//   aSeed       float  — stable per-particle random [0,1]
//   aDelay      float  — per-particle morph delay offset
//   aSize       float  — base point size
//
// Fragment uniforms
//   uTime       float  — elapsed seconds
//   uOpacity    float  — master opacity
//   uColorCore  vec3   — white-ish core color
//   uColorTint  vec3   — light-blue per-particle tint
//   uColorCool  vec3   — cool accent (cyan end of ramp)
//   uColorWarm  vec3   — warm accent (violet end of ramp)

import { curlNoiseChunk } from "./curlNoise";

export const headlineParticlesVertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uPixelRatio;
uniform float uHalfWidth;
uniform float uChain;
uniform float uGlitch;
uniform float uNameMorph;
attribute vec3 aLattice;
attribute vec3 aAttractor;
attribute vec3 aKnot;
attribute vec3 aFibration;
attribute vec3 aName;
attribute float aSeed;
attribute float aDelay;
attribute float aSize;
varying float vSeed;
varying float vSettle;
varying float vEdge;
varying float vMorph;
varying float vGlitch;
${curlNoiseChunk}

// Staggered eased segment progress: each particle starts its leg of the
// journey a little late depending on aDelay, so forms condense rather than
// snap. x is the raw 0..1 segment fraction.
float stagger(float x, float delay) {
  float t = clamp(x * 1.35 - delay * 0.35, 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  // The chain: wordmark → lattice → attractor → knot, scrubbed by scroll.
  float f1 = stagger(clamp(uChain, 0.0, 1.0), aDelay);
  float f2 = stagger(clamp(uChain - 1.0, 0.0, 1.0), aDelay);
  float f3 = stagger(clamp(uChain - 2.0, 0.0, 1.0), aDelay);
  float f4 = stagger(clamp(uChain - 3.0, 0.0, 1.0), aDelay);
  vec3 home = position;
  home = mix(home, aLattice, f1);
  home = mix(home, aAttractor, f2);
  home = mix(home, aKnot, f3);
  home = mix(home, aFibration, f4);

  // Finale: the knot condenses into the author's name.
  float nameT = stagger(uNameMorph, aDelay);
  home = mix(home, aName, nameT);
  // Storm life (churn, spin) dies down as the name forms — type wants stillness.
  float calm = 1.0 - nameT;

  // Mid-flight bell for every chain leg: peaks halfway through a transition,
  // zero while a form holds. Drives the turbulence that makes the morphs read
  // as particle flight instead of crossfade.
  float flight = f1 * (1.0 - f1) + f2 * (1.0 - f2) + f3 * (1.0 - f3) + f4 * (1.0 - f4);

  // How far off the wordmark we are (0 text, 1 any form).
  float offText = clamp(uChain, 0.0, 1.0);
  // Attractor presence: form B is the chaos beat — churn surges while held.
  float wChaos = clamp(1.0 - abs(uChain - 2.0), 0.0, 1.0);

  // Galaxy origin: golden-angle disc all around the composition.
  float ga = aSeed * 6.2831853 + fract(aSeed * 7.31) * 6.2831853;
  float radius = 4.0 + fract(aSeed * 3.91) * 5.0;
  vec3 start = vec3(
    cos(ga) * radius,
    sin(ga) * radius * 0.62,
    -2.0 + fract(aSeed * 5.77) * 4.0
  );

  // Arrival wavefront: delays correlate with the origin angle (plus a little
  // per-particle noise), so convergence sweeps around the ring like a wave
  // instead of uniform noise condensing everywhere at once.
  float angleDelay = 0.5 + 0.5 * sin(ga * 2.0);
  float delay = angleDelay * 0.6 + aDelay * 0.3;
  float t = clamp(uProgress * 1.9 - delay * 0.9, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);

  // Gentle spiral convergence (much calmer than before).
  vec3 off = start - home;
  float ang = (1.0 - t) * (1.1 + fract(aSeed * 2.63) * 0.5);
  float ca = cos(ang);
  float sa = sin(ang);
  off.xy = mat2(ca, -sa, sa, ca) * off.xy;
  vec3 p = home + off * (1.0 - t);

  // ONE curl sample per vertex, reused for every motion layer below — the
  // previous build sampled the (expensive) curl field four times per vertex
  // and that was the frame-budget killer.
  float storm = 0.5 + 0.5 * sin(uTime * 0.17 + 1.3)
              + 0.25 * sin(uTime * 0.31 + 5.1);
  storm = pow(clamp(storm * 0.8, 0.0, 1.0), 2.0);
  float churnFreq = mix(0.9, 0.5, offText);
  vec3 c = curlNoise(home * churnFreq + uTime * (0.10 + offText * 0.08));

  // Organic flight: en route, particles ride the shared curl flow, strongest
  // mid-flight, so the galaxy collapses as braided streams. Chain transitions
  // reuse the same flow so every leg flies as turbulence, not a crossfade.
  float bell = sin(t * 3.14159265);
  p += c * (1.1 * bell + 0.9 * flight) * calm;

  // --- Settled life -------------------------------------------------------
  // Curl fold + a cheap sine-detail octave (replaces the second curl sample).
  vec3 detail = vec3(
    sin(uTime * 0.9 + home.x * 3.1 + home.y * 1.7),
    cos(uTime * 0.7 + home.y * 2.7 + home.z * 2.1),
    sin(uTime * 0.8 + home.z * 2.4)
  );
  // Idle character per form: the lattice and knot hold nearly still (crisp
  // geometry), the attractor churns — chaos is the middle act.
  float churn = (0.35 + offText * 0.5 + wChaos * (2.0 + 6.0 * storm)) * mix(0.08, 1.0, calm);
  p += (c * 0.075 + detail * 0.02) * churn * t;

  // Storm wisps reuse the same curl sample, swizzled (free decorrelation) —
  // attractor-only, so the chaos beat boils while the ordered forms stay calm.
  p += c.zxy * wChaos * storm * 0.4 * t * calm;

  // Corruption burst: the type glitches in place. Horizontal slices of the
  // text shear sideways by quantized amounts (classic VHS row-tear), plus a
  // tiny per-particle shiver — particles stay essentially where they are, the
  // letterforms just tear and reassemble. Text-mode only: the wordmark at the
  // start, the invitation at the end — the abstract forms never tear.
  float snap = floor(uTime * 16.0);
  float band = floor(home.y * 5.0) + snap * 7.0;
  float bandShear = (fract(sin(band * 12.9898) * 43758.5453) - 0.5)
                  * step(0.4, fract(band * 0.618));
  float shiver = fract(aSeed * 41.7 + snap * 0.317) - 0.5;
  float textMode = max(1.0 - offText, nameT);
  p.x += bandShear * 0.3 * uGlitch * textMode;
  p += vec3(shiver * 0.05, 0.0, shiver * 0.03) * uGlitch;
  vGlitch = uGlitch * (0.4 + 0.6 * abs(bandShear) * 2.0);

  // The forms slowly revolve so they read as living mass; spin dies fully
  // before the name forms or the type would rotate out of legibility.
  float spin = uTime * 0.08 * offText * calm;
  float cs = cos(spin); float ss = sin(spin);
  p.xz = mat2(cs, -ss, ss, cs) * p.xz;

  vMorph = offText;
  vSeed = aSeed;
  vSettle = t;
  // Right-edge factor for the pixel-dissolve character (blog.maximeheckel.com).
  vEdge = smoothstep(0.15, 1.0, position.x / max(uHalfWidth, 0.001));

  vec4 modelPosition = modelMatrix * vec4(p, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = aSize * uPixelRatio * (1.0 / -viewPosition.z) * mix(1.8, 1.0, t);
}
`;

export const headlineParticlesFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColorCore;
uniform vec3 uColorTint;
uniform vec3 uColorCool;
uniform vec3 uColorWarm;
varying float vSeed;
varying float vSettle;
varying float vEdge;
varying float vMorph;
varying float vGlitch;

void main() {
  vec2 pc = gl_PointCoord - 0.5;

  // Soft disc: radial falloff with a crisp-ish core for a draughtsman point.
  float disc = 1.0 - length(pc) * 2.0;
  disc = pow(max(disc, 0.0), 2.2);

  // Pixel-dissolve character: a subset of right-edge particles render as tiny
  // crisp squares and dither in/out, like the blog hero's pixelated edge.
  float pixelGate = step(0.7, fract(vSeed * 13.7)) * vEdge * vSettle;
  float square = step(max(abs(pc.x), abs(pc.y)), 0.34);
  float dither = step(0.3, fract(vSeed * 91.0 + floor(uTime * 2.5) * 0.381));

  float strength = mix(disc, square * 0.85, pixelGate);
  if (strength <= 0.003) discard;

  // White core with a light-blue tint per particle, plus a subtle cool→warm
  // accent ramp across particles (cyan to soft violet); the accent deepens as
  // the wordmark leaves text mode so the forms pick up the gradient character.
  vec3 color = mix(uColorCore, uColorTint, fract(vSeed * 5.7) * 0.65);
  vec3 accent = mix(uColorCool, uColorWarm, fract(vSeed * 3.31 + vEdge * 0.4));
  color = mix(color, accent, 0.22 + 0.33 * vMorph);
  // Corrupted particles flash hard toward the accent ends — a cheap stand-in
  // for RGB-split, split across the particle population instead of the frame.
  vec3 hot = mix(uColorCool, uColorWarm, step(0.5, fract(vSeed * 23.7)));
  color = mix(color, hot, vGlitch * 0.4);
  float flicker = 0.92 + 0.08 * sin(uTime * (1.2 + vSeed) + vSeed * 90.0);
  float breath = 0.82 + 0.18 * sin(uTime * 0.7 + vSeed * 40.0);

  float alpha = strength * flicker * breath * mix(0.35, 1.0, vSettle) * uOpacity;
  alpha *= mix(1.0, dither * 0.8, pixelGate);
  gl_FragColor = vec4(color, alpha);
}
`;
