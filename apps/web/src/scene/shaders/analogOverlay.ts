// Analog overlay: fullscreen screen-space quad rendered over the scene.
// Carries per-frame re-seeded signed film grain (Kodak Gold-ish).
// The analog drift/tracking-tear effect is handled separately in
// postprocessing/GlitchBandEffect.ts.
//
// Uniforms
//   uTime     float  — elapsed seconds (re-seeds grain each frame)
//   uOpacity  float  — master opacity for the overlay

export const analogOverlayVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  // Fullscreen in clip space regardless of camera: plane verts are ±0.5.
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

export const analogOverlayFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
varying vec2 vUv;

// High-quality per-pixel white noise (no visible lattice structure).
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  // Soft photographic grain, Kodak Gold-ish: fine per-pixel luminance noise,
  // re-seeded per frame, gentle amplitude. Both brightens and darkens so it
  // reads like film, not like a texture laid over the scene.
  float g = hash21(vUv * vec2(1421.7, 1373.3) + fract(uTime * 17.0) * 113.1) - 0.5;

  // (The analog drift line is a true frame distortion now — see
  // GlitchBandEffect.ts — so this overlay only carries the film grain.)
  float lum = g * 0.035;
  // Signed luminance: positive brightens (white), negative darkens (black).
  vec3 color = lum > 0.0 ? vec3(1.0) : vec3(0.0);
  gl_FragColor = vec4(color, abs(lum) * uOpacity);
}
`;
