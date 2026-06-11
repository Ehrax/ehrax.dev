// Offscreen-canvas glyph sampler + procedural form samplers for
// HeadlineParticles. Produces one set of per-particle "homes" for every stop
// of the hero performance chain:
//   welcome → phyllotaxis sphere → Aizawa attractor → torus knot → name
// Run once per viewport-width change; result is stable until width changes.
import { PARTICLE_COUNT, textHalfWidth } from "~/scene/scenes/landingTuning";

export type HeadlineData = {
  targets: Float32Array;
  /** Form A: phyllotaxis (Fibonacci-lattice) sphere — order. */
  lattices: Float32Array;
  /** Form B: Aizawa strange-attractor trajectory — chaos. */
  attractors: Float32Array;
  /** Form C: torus knot (3,7) tube — order again. */
  knots: Float32Array;
  /** Form D: Hopf fibration — linked fiber circles on nested tori. */
  fibrations: Float32Array;
  /** Finale home: the author's name, stacked on two lines. */
  names: Float32Array;
  seeds: Float32Array;
  delays: Float32Array;
  sizes: Float32Array;
};

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Form A — phyllotaxis sphere: every particle on a Fibonacci lattice, so the
// wordmark snaps into *perfect* order. Counter-rotating spiral families give
// a moiré shimmer under the slow scene spin. Jitter is tiny on purpose.
function sampleLattice(out: Float32Array, i: number): void {
  const z = 1 - (2 * (i + 0.5)) / PARTICLE_COUNT;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  const theta = GOLDEN_ANGLE * i;
  const radius = 1.55;
  out[i * 3] = Math.cos(theta) * r * radius + (Math.random() - 0.5) * 0.03;
  out[i * 3 + 1] = z * radius + (Math.random() - 0.5) * 0.03;
  out[i * 3 + 2] = Math.sin(theta) * r * radius + (Math.random() - 0.5) * 0.03;
}

// Form B — Aizawa attractor: one long trajectory integrated up front, then
// handed out point-by-point. Density follows the dynamics (slow regions glow
// brighter), which is the whole charm — a hollow globe pierced by a jet.
function buildAttractor(): Float32Array {
  const pts = new Float32Array(PARTICLE_COUNT * 3);
  const a = 0.95;
  const b = 0.7;
  const c = 0.6;
  const d = 3.5;
  const e = 0.25;
  const f = 0.1;
  const dt = 0.012;
  let x = 0.1;
  let y = 0;
  let z = 0;
  const step = () => {
    const dx = (z - b) * x - d * y;
    const dy = d * x + (z - b) * y;
    const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  };
  // Burn in past the transient so every recorded point lies on the attractor.
  for (let i = 0; i < 1200; i++) step();
  const scale = 1.15;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    step();
    pts[i * 3] = x * scale + (Math.random() - 0.5) * 0.05;
    pts[i * 3 + 1] = (z - 0.75) * scale + (Math.random() - 0.5) * 0.05;
    pts[i * 3 + 2] = y * scale + (Math.random() - 0.5) * 0.05;
  }
  return pts;
}

// Form C — torus knot (3,7): a single woven closed ribbon. Particles are
// spread along the curve with a fuzzy tube cross-section so it reads as one
// continuous flowing strand, not beads on a wire.
function sampleKnot(out: Float32Array, i: number): void {
  const p = 3;
  const q = 7;
  const t = (i / PARTICLE_COUNT) * Math.PI * 2;
  const r = Math.cos(q * t) + 2;
  const scale = 0.58;
  const tube = 0.13;
  out[i * 3] = r * Math.cos(p * t) * scale + (Math.random() - 0.5) * tube;
  out[i * 3 + 1] = -Math.sin(q * t) * scale * 1.4 + (Math.random() - 0.5) * tube;
  out[i * 3 + 2] = r * Math.sin(p * t) * scale + (Math.random() - 0.5) * tube;
}

// Form D — Hopf fibration: a band of base points on S² each lifts to a great
// circle in S³; stereographic projection lands the fibers as linked circles
// tiling nested tori. Every circle links every other — the finale form, and
// its diffuse nested structure dissolves beautifully into the section fade.
function buildFibration(): Float32Array {
  const pts = new Float32Array(PARTICLE_COUNT * 3);
  const FIBERS = 42;
  const PER_FIBER = PARTICLE_COUNT / FIBERS;
  let i = 0;
  for (let fiber = 0; fiber < FIBERS; fiber++) {
    // Base points sweep a spiral band across S², keeping clear of the poles
    // so the projected circles stay bounded and the tori read as nested.
    // The narrow band + generous projection scale keeps the individual rings
    // separated enough to read as linked circles instead of a fuzzy ball.
    const band = fiber / FIBERS;
    const theta = (0.34 + band * 0.38) * Math.PI;
    const phi = band * Math.PI * 4;
    const cosHalf = Math.cos(theta / 2);
    const sinHalf = Math.sin(theta / 2);
    for (let k = 0; k < PER_FIBER && i < PARTICLE_COUNT; k++, i++) {
      const t = (k / PER_FIBER) * Math.PI * 2;
      // Fiber point on S³ as two complex numbers (z1, z2).
      const x1 = cosHalf * Math.cos(t + phi);
      const y1 = cosHalf * Math.sin(t + phi);
      const x2 = sinHalf * Math.cos(t);
      const y2 = sinHalf * Math.sin(t);
      // Stereographic projection from the pole y2 = 1.
      const w = 1.3 - y2;
      const scale = 0.85;
      pts[i * 3] = (x1 / w) * scale + (Math.random() - 0.5) * 0.035;
      pts[i * 3 + 1] = (x2 / w) * scale + (Math.random() - 0.5) * 0.035;
      pts[i * 3 + 2] = (y1 / w) * scale + (Math.random() - 0.5) * 0.035;
    }
  }
  return pts;
}

// Rasterize a line of text on an offscreen canvas and collect lit pixels.
function sampleGlyphPixels(
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
  width: number,
  height: number,
): { candidates: Array<[number, number]>; width: number; height: number } {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const candidates: Array<[number, number]> = [];
  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    draw(ctx, canvas);
    const pixels = ctx.getImageData(0, 0, width, height).data;
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        if (pixels[(y * width + x) * 4 + 3] > 128) candidates.push([x, y]);
      }
    }
  }
  if (candidates.length === 0) candidates.push([width / 2, height / 2]);
  return { candidates, width, height };
}

// Sample "welcome." glyph pixels plus every chain form's home positions.
export function sampleHeadline(worldWidth: number): HeadlineData {
  const targets = new Float32Array(PARTICLE_COUNT * 3);
  const lattices = new Float32Array(PARTICLE_COUNT * 3);
  const knots = new Float32Array(PARTICLE_COUNT * 3);
  const names = new Float32Array(PARTICLE_COUNT * 3);
  const seeds = new Float32Array(PARTICLE_COUNT);
  const delays = new Float32Array(PARTICLE_COUNT);
  const sizes = new Float32Array(PARTICLE_COUNT);

  const attractors = buildAttractor();
  const fibrations = buildFibration();

  const wordmark = sampleGlyphPixels(
    (ctx, canvas) => {
      ctx.font = '600 150px "Inter", "Helvetica Neue", system-ui, sans-serif';
      ctx.fillText("welcome.", canvas.width / 2, canvas.height / 2);
    },
    1000,
    240,
  );

  // Finale home: the closing call-to-action, set in particles as the contact
  // title. Two short lines, deliberately smaller than the hero forms so it
  // reads as an invitation rather than a monument.
  const name = sampleGlyphPixels(
    (ctx, canvas) => {
      ctx.font = '600 96px "Inter", "Helvetica Neue", system-ui, sans-serif';
      ctx.fillText("Want to get in touch?", canvas.width / 2, canvas.height / 2 - 66);
      ctx.fillText("Or just say hi?", canvas.width / 2, canvas.height / 2 + 66);
    },
    1400,
    360,
  );

  const textWorldWidth = textHalfWidth(worldWidth) * 2;
  const scale = textWorldWidth / wordmark.width;
  // Smaller than the hero wordmark: the invitation sits modestly, not at
  // full headline scale.
  const nameScale = (textWorldWidth * 0.62) / name.width;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const [px, py] = wordmark.candidates[Math.floor(Math.random() * wordmark.candidates.length)];
    // Tight, draughtsman-like placement: sub-pixel jitter only.
    targets[i * 3] = (px - wordmark.width / 2 + (Math.random() - 0.5) * 2.2) * scale;
    targets[i * 3 + 1] = -(py - wordmark.height / 2 + (Math.random() - 0.5) * 2.2) * scale;
    targets[i * 3 + 2] = (Math.random() - 0.5) * 0.06;

    sampleLattice(lattices, i);
    sampleKnot(knots, i);

    const [nx, ny] = name.candidates[Math.floor(Math.random() * name.candidates.length)];
    names[i * 3] = (nx - name.width / 2 + (Math.random() - 0.5) * 2.2) * nameScale;
    names[i * 3 + 1] = -(ny - name.height / 2 + (Math.random() - 0.5) * 2.2) * nameScale;
    names[i * 3 + 2] = (Math.random() - 0.5) * 0.06;

    seeds[i] = Math.random();
    // Fully random delays: forms condense from every side at once.
    delays[i] = Math.random();
    sizes[i] = 26 + Math.random() * 22;
  }

  return { targets, lattices, attractors, knots, fibrations, names, seeds, delays, sizes };
}
