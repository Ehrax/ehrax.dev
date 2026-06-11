// VHS tracking glitch: a thin horizontal slice of the rendered frame gets
// displaced sideways as a band drifts down the screen. This is a true UV
// distortion of the frame (not drawn light), so the wordmark, grid and labels
// all shear together exactly like an analog signal dropout.
import { Effect } from "postprocessing";
import { Uniform } from "three";

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uStrength;

float bandProfile(float dy, float sharpness) {
  return exp(-dy * dy * sharpness);
}

// One tracking band: a thin primary slice plus an even thinner secondary
// slice just below, like a tracking error tearing two scanline groups.
float trackingBand(vec2 uv, float time, float period, float phase) {
  float cycle = fract(time / period + phase);
  float bandY = 1.08 - cycle * 1.3;
  float dy = uv.y - bandY;
  float slice = bandProfile(dy, 42000.0);
  float slice2 = bandProfile(dy - 0.008, 160000.0) * 0.6;
  // Jitter the shear amount over time so each pass tears differently.
  float jitter = 0.6 + 0.4 * sin(time * 31.0 + uv.y * 80.0 + phase * 37.0);
  float gate = smoothstep(0.95, 0.88, cycle);
  return (slice + slice2) * jitter * gate;
}

void mainUv(inout vec2 uv) {
  // Two independent bands on incommensurate periods, so a pass happens every
  // few seconds but the pair never locks into a visible rhythm. First passes
  // wait until well after the entrance.
  float entry = smoothstep(7.0, 9.0, uTime);
  float shear = trackingBand(uv, uTime, 9.0, 0.0)
              + trackingBand(uv, uTime, 12.7, 0.43) * 0.8;
  uv.x += shear * entry * uStrength;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = inputColor;
}
`;

export class GlitchBandEffect extends Effect {
  constructor() {
    super("GlitchBand", fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ["uTime", new Uniform(0)],
        ["uStrength", new Uniform(0.018)],
      ]),
    });
  }

  setStrength(value: number) {
    const u = this.uniforms.get("uStrength");
    if (u) u.value = value;
  }

  override update(_renderer: unknown, _inputBuffer: unknown, deltaTime?: number) {
    const u = this.uniforms.get("uTime");
    if (u) u.value += deltaTime ?? 0;
  }
}
