// Fireflies: sparse glowing motes drifting lazily above the blueprint floor
// (the anime "hotaru" atmosphere layer). One points draw call; all motion is
// in-shader from per-particle seeds, so the buffer never updates.
//
// Uniforms
//   uTime       float — elapsed seconds (frozen under reduced motion)
//   uOpacity    float — master opacity (scene effect opacity)
//   uPixelRatio float — window.devicePixelRatio
//   uColorCool  vec3  — cool accent tint
//   uColorWarm  vec3  — warm accent tint
//
// Attributes
//   position vec3  — home position above the floor
//   aSeed    float — stable per-firefly random [0,1]
//   aSize    float — base point size

export const firefliesVertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSeed;
attribute float aSize;
varying float vSeed;

void main() {
  // Lazy figure-eight drift, unique per firefly. Slow enough to read as
  // floating embers, not weather.
  float t = uTime * (0.12 + aSeed * 0.1) + aSeed * 31.4;
  vec3 p = position;
  p.x += sin(t) * (0.5 + aSeed * 0.5);
  p.y += sin(t * 1.7 + aSeed * 9.0) * 0.3;
  p.z += cos(t * 0.8 + aSeed * 4.0) * 0.45;

  vec4 viewPosition = viewMatrix * modelMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = aSize * uPixelRatio * (1.0 / -viewPosition.z);
  vSeed = aSeed;
}
`;

export const firefliesFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColorCool;
uniform vec3 uColorWarm;
varying float vSeed;

void main() {
  vec2 pc = gl_PointCoord - 0.5;
  // Bright pinprick core inside a wide soft halo — the glow IS the particle.
  float d = length(pc) * 2.0;
  float halo = pow(max(1.0 - d, 0.0), 1.6);
  float core = pow(max(1.0 - d * 2.6, 0.0), 2.0);
  float strength = halo * 0.45 + core;
  if (strength <= 0.004) discard;

  // Slow individual pulse — fireflies breathe out of phase with each other.
  float pulse = 0.55 + 0.45 * sin(uTime * (0.5 + vSeed * 0.7) + vSeed * 80.0);

  vec3 color = mix(uColorCool, uColorWarm, fract(vSeed * 7.13));
  gl_FragColor = vec4(color, strength * pulse * uOpacity);
}
`;
