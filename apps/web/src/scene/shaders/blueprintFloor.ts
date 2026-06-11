// Blueprint drafting floor: tilted 3D plane with a calm minor/major grid,
// two dashed construction circles, crosshair registration marks, a radial
// roll-out reveal, horizon fade, and subtle in-shader grain.
//
// Uniforms
//   uTime     float  — elapsed seconds (drives in-shader grain seed)
//   uOpacity  float  — master opacity, multiplies final alpha
//   uReveal   float  — 0→1 radial roll-out progress (driven by entrance animation)
//   uSize     vec2   — plane dimensions in grid units (one cell = one unit)
//   uLineColor vec3  — RGB tint for all lines (blueprint blue)

export const blueprintFloorVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const blueprintFloorFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform float uReveal;
uniform float uFlicker;
uniform vec2 uSize;
uniform vec3 uLineColor;
uniform vec4 uLamps[3];
uniform vec3 uLampColors[3];
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Anti-aliased line mask for a 1D repeating coordinate.
float lineMask(float coord) {
  float d = abs(fract(coord - 0.5) - 0.5);
  float w = fwidth(coord);
  return 1.0 - smoothstep(0.0, w * 1.4, d);
}

float dashedCircle(vec2 p, vec2 center, float radius, float dashes) {
  float d = abs(length(p - center) - radius);
  float w = fwidth(length(p - center));
  float ring = 1.0 - smoothstep(0.0, w * 1.6, d);
  float angle = atan(p.y - center.y, p.x - center.x);
  float dash = step(0.5, fract(angle / 6.2831853 * dashes));
  return ring * dash;
}

// Crosshair tick mark (draughtsman registration mark).
float crosshair(vec2 p, vec2 center, float size) {
  vec2 d = abs(p - center);
  float w = fwidth(p.x) * 1.4;
  float h = (1.0 - smoothstep(0.0, w, d.y)) * step(d.x, size);
  float v = (1.0 - smoothstep(0.0, w, d.x)) * step(d.y, size);
  return max(h, v);
}

void main() {
  // Plane-space coordinates in grid units; one cell = one unit.
  vec2 p = (vUv - 0.5) * uSize;

  // Calm draughtsman grid: faint minors, slightly stronger majors every 8.
  float minorRaw = max(lineMask(p.x), lineMask(p.y));
  float majorX = lineMask(p.x / 8.0);
  float majorY = lineMask(p.y / 8.0);
  float minor = minorRaw * 0.055;
  float major = max(majorX, majorY) * 0.16;

  // Dancefloor lamps: up to 3 lamps live under the glass at once, each parked
  // at a cell center (uLamps[i].xy in grid units, .w = intensity driven by a
  // CPU-side ignite/hold/decay envelope). Each lamp is a hot core confined to
  // its cell plus an inverse-square pool that spills across neighboring cells
  // and grid lines — real falloff, not a painted tile. Output is HDR (>1):
  // the post chain's bloom and tone mapping turn the core white and bleed a
  // halo, which is what makes it read as light.
  vec3 lamp = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    vec2 toLamp = p - uLamps[i].xy;
    float inten = uLamps[i].w;
    // Cell pane: soft-edged fill of the lamp's own cell.
    float sq = max(abs(toLamp.x), abs(toLamp.y));
    float pane = 1.0 - smoothstep(0.30, 0.5, sq);
    // Light pool: inverse-square spill reaching ~2 cells out.
    float pool = 1.0 / (1.0 + dot(toLamp, toLamp) * 1.8);
    lamp += uLampColors[i] * inten * (pane * 0.8 + pool * 0.3);
  }
  // Grid lines inside a pool catch the light (glass seams over the lamp).
  lamp *= 1.0 + minorRaw * 0.6;
  lamp *= uFlicker;

  // Trace routes: data packets traveling along major grid lines — a bright
  // head with a decaying tail, one lane direction per axis, speed and phase
  // hashed per lane so packets never march in formation.
  float laneX = floor(p.x / 8.0 + 0.5);
  float laneY = floor(p.y / 8.0 + 0.5);
  float hx = hash21(vec2(laneX, 3.7));
  float hy = hash21(vec2(laneY, 8.1));
  float sx = fract((p.y * sign(hx - 0.5) - uTime * (2.0 + hx * 3.0)) / 26.0);
  float sy = fract((p.x * sign(hy - 0.5) - uTime * (2.0 + hy * 3.0)) / 26.0);
  float traces = majorX * step(0.55, fract(hx * 9.3)) * smoothstep(0.10, 0.0, sx)
               + majorY * step(0.55, fract(hy * 9.3)) * smoothstep(0.10, 0.0, sy);
  traces *= 0.5 * uFlicker;

  // Two faint dashed construction circles + registration marks, floor-scale.
  float circles = 0.0;
  circles += dashedCircle(p, vec2(0.0, -2.0), 9.0, 72.0);
  circles += dashedCircle(p, vec2(-11.0, 4.0), 4.5, 48.0);
  circles *= 0.10;

  float marks = 0.0;
  marks += crosshair(p, vec2(0.0, -2.0), 0.6);
  marks += crosshair(p, vec2(-11.0, 4.0), 0.45);
  marks *= 0.18;

  float lines = minor + major + circles + marks + traces;

  // Roll-out reveal: grid lines draw outward from the center on load.
  float r = length(p);
  float reveal = smoothstep(uReveal * 42.0 + 1.0, uReveal * 42.0 - 7.0, r);
  lines *= reveal;
  lamp *= reveal;

  // Horizon fade: the far edge of the floor melts into the background, and
  // the near edge softens too so the plane never shows a hard rectangle.
  float horizon = 1.0 - smoothstep(0.55, 0.98, vUv.y);
  float near = smoothstep(0.0, 0.12, vUv.y);
  lines *= horizon * near;
  lamp *= horizon * near;

  // Faint in-shader grain to break banding (the animated film grain lives in
  // the post pass).
  float grain = (hash21(vUv * vec2(1920.0, 1080.0) + fract(uTime * 0.31) * 91.7) - 0.5) * 0.03;

  // Energy lives in RGB, not alpha: the lamp term is pushed into HDR (×3) so
  // the post chain's bloom blooms it and tone mapping whitens the hot core.
  // Alpha only opens the surface where there is light to show — a transparent
  // material can't bloom what it hides in alpha.
  float lampLum = max(max(lamp.r, lamp.g), lamp.b);
  float energy = lines + lampLum;
  float alpha = clamp(energy + max(grain, 0.0) * 0.5, 0.0, 1.0) * uOpacity;
  vec3 color = (uLineColor * lines + lamp * 2.2) / max(energy, 1e-4) + grain;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;
