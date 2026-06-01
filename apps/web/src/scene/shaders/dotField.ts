export const dotFieldVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const dotFieldFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;

  float random(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 value) {
    vec2 i = floor(value);
    vec2 f = fract(value);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    vec2 grid = fract((uv + vec2(uTime * 0.012, -uTime * 0.018)) * 42.0) - 0.5;
    float dots = smoothstep(0.23, 0.02, length(grid));
    float wave = noise(uv * 4.0 + uTime * 0.06);
    float vignette = smoothstep(0.88, 0.2, distance(uv, vec2(0.5)));
    vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 1.0, uProgress));
    float alpha = (dots * 0.18 + wave * 0.08) * vignette;

    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`;
