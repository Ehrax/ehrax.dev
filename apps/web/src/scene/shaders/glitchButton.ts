// Glitch button: a cyberpunk HUD chip drawn on a single additive plane — a
// chamfered (cut-corner) outline with bright corner brackets, a faint
// scanlined interior that powers up on hover, and row-slice displacement when
// the shared corruption clock fires. No soft rounded glow: the border is a
// crisp energized line, the brackets carry the brightness.
//
// Uniforms
//   uTime    float — elapsed seconds
//   uHover   float — 0..1 hover/focus weight (smoothed by the caller)
//   uGlitch  float — corruption-burst envelope shared with the headline
//   uReveal  float — master opacity (contact reveal)
//   uAspect  float — plane width / height, so chamfers stay 45°
//   uColor   vec3  — resting border colour
//   uColorHot vec3 — colour the chip flushes toward when lit/glitching

export const glitchButtonVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const glitchButtonFragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uHover;
uniform float uGlitch;
uniform float uReveal;
uniform float uAspect;
uniform vec3 uColor;
uniform vec3 uColorHot;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

// Signed distance to a chamfered rectangle: an axis box clipped by 45° corner
// planes (half-size b, chamfer c). d=0 is the outline.
float sdChamferRect(vec2 p, vec2 b, float c) {
  float dBox = max(abs(p.x) - b.x, abs(p.y) - b.y);
  float dCut = (abs(p.x) + abs(p.y)) - (b.x + b.y - c);
  return max(dBox, dCut);
}

void main() {
  // Work in a space where x is scaled by aspect so chamfers read as 45°.
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);

  // Corruption: whole horizontal slices of the chip shear sideways while the
  // burst runs — the classic datamosh tear — plus a permanent hairline jitter.
  float row = floor(vUv.y * 12.0);
  float snap = floor(uTime * 18.0);
  float band = step(0.6, hash(row + snap * 3.7));
  float shear = band * (uGlitch * 0.09 + 0.0015) * (hash(row * 1.7 + snap) - 0.5) * 2.0;
  p.x += shear * uAspect;

  vec2 b = vec2(0.5 * uAspect, 0.5) - 0.06;
  float chamfer = 0.16;
  float d = sdChamferRect(p, b, chamfer);

  // Crisp energized outline — thin core line plus a tight haze, no blob halo.
  float line = exp(-abs(d) * mix(70.0, 46.0, uHover));
  float haze = exp(-abs(d) * 14.0) * (0.10 + uHover * 0.30);

  // Corner brackets: the outline brightens hard near the four chamfers, like
  // a targeting reticle locking on.
  float cornerness = smoothstep(b.x + b.y - chamfer - 0.22, b.x + b.y - chamfer, abs(p.x) + abs(p.y));
  float bracket = line * cornerness * (1.2 + uHover * 1.4);

  // Interior: scanlined energy fill that powers up on hover, with a slow
  // sweep line drifting through it.
  float inside = smoothstep(0.0, -0.03, d);
  float scan = 0.75 + 0.25 * sin(vUv.y * 90.0 + uTime * 2.0);
  float sweep = exp(-pow((vUv.x - fract(uTime * 0.18) * 1.4 + 0.2) * 9.0, 2.0));
  float fill = inside * scan * (0.05 + uHover * 0.16 + sweep * (0.04 + uHover * 0.10));

  float tearGlow = band * uGlitch * 0.9;
  float intensity = line * (0.5 + uHover * 0.7) + haze + bracket + fill;
  intensity *= 1.0 + tearGlow;

  // Flush from resting blueprint blue toward the hot accent as it lights up;
  // the brackets and tears always run hot.
  vec3 col = mix(uColor, uColorHot, clamp(uHover + cornerness * 0.5 + tearGlow, 0.0, 1.0));
  float alpha = clamp(intensity, 0.0, 1.0) * uReveal;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col * intensity, alpha);
}
`;
