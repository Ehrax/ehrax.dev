// Single tuning surface for the hero landing scene.
// All constants live here so the whole hero can be adjusted from one file.
//
// Design framing: a genuinely 3D blueprint drafting floor seen from ~45° above
// with a slight diagonal roll (Maxime-style isometric drafting-table framing),
// not a backdrop. The floor rolls out from the center on load then holds; only
// the wordmark/blob in the middle transforms on scroll.
import { Color } from "three";

// Blueprint field color stops — raw hex is intentional; these live inside
// Three.js and are not part of the CSS token system.
export const BLUEPRINT_START = "#0c1f4e";
export const BLUEPRINT_HOLD = "#0e1a38";

// Color instances created once at module scope to avoid per-frame allocations.
export const GRID_LINE_COLOR = new Color("#7fa8e8");
export const PARTICLE_CORE = new Color("#f4f8ff");
export const PARTICLE_TINT = new Color("#8db4f2");
// Accent ramp ends (Maxime's blog hero lives on a cyan→pink gradient; we keep
// it subtler so the wordmark stays blueprint-white at heart).
export const PARTICLE_ACCENT_COOL = new Color("#7ee8ff");
export const PARTICLE_ACCENT_WARM = new Color("#d9a8ff");

// Dancefloor lamps: how many can glow under the glass at once, and the grid
// region (in cell units, centered) they may spawn in — kept inside the part
// of the floor the camera actually sees.
// Must match the fixed array size in blueprintFloor's fragment shader.
export const LAMP_COUNT = 3;
export const LAMP_FIELD: [number, number] = [30, 20];

// Lamp palette: blues and cyans from the scene's own family (grid blue,
// particle tint, accent cyan) plus a blue-leaning violet and near-white.
// NOTE: these are rendered in HDR (×2+) through bloom + ACES tone mapping,
// which compresses blue harder than red at high intensity — a red-leaning
// violet like the wordmark's #d9a8ff comes out PINK on the floor. Keep every
// lamp color blue-dominant so it still reads in-family at full brightness.
export const CELL_GLOW_COLORS = [
  new Color("#7ee8ff"), // accent cyan
  new Color("#a9a4ff"), // blue violet (reads as the wordmark violet under HDR)
  new Color("#8db4f2"), // grid blue
  new Color("#a9c8ff"), // ice blue
  new Color("#e8f2ff"), // near-white
];

// PARTICLE_COUNT is validated on low-end devices at 12 000.
// Do NOT increase this budget without re-profiling on a constrained target.
export const PARTICLE_COUNT = 12000;

export const ENTRANCE_SECONDS = 4.4;

// Nav chrome enters a beat after the wordmark has fully assembled; the hero
// identity copy then staggers in after the nav via CSS transition-delay.
export const NAV_REVEAL_SECONDS = ENTRANCE_SECONDS + 0.6;

// The blueprint is a genuinely 3D drafting floor seen from ~45° above with a
// slight diagonal roll (Maxime-style isometric drafting-table framing), not a
// backdrop far behind the text. It rolls out from the center on load, keeps a
// slow breathing tilt, and the whole scene rolls over like a book page as the
// user scrolls toward About.
export const FLOOR_SIZE: [number, number] = [72, 44];
export const FLOOR_TILT = -0.9;
export const FLOOR_ROLL_Z = -0.16;
export const FLOOR_POSITION: [number, number, number] = [0, -1.1, -1.2];

// The wordmark lies in the drafting table's plane (Maxime-style), tilted most
// of the way into the floor and sharing its diagonal roll, so it reads as
// drawn on the blueprint rather than floating in front of it.
export const TEXT_TILT = FLOOR_TILT * 0.6;

// The hero performance: the wordmark morphs through a scroll-scrubbed chain
// of four mathematical forms — order → chaos → order → transcendence — and
// the whole show is over before the About copy is readable.
//   welcome → phyllotaxis sphere → Aizawa attractor → torus knot
//           → Hopf fibration → fade
// Each window is [start, end] in DOCUMENT scroll space (not controller space:
// the controller's hero-text-exit boost would compress the first two legs
// into a blink). The hero section spans roughly the first 0.45 of document
// scroll, so the chain finishes inside the hero with room to idle per form.
export const CHAIN_WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [0.025, 0.09], // wordmark → phyllotaxis sphere
  [0.12, 0.19], // sphere → Aizawa attractor
  [0.22, 0.29], // attractor → torus knot
  [0.32, 0.385], // knot → Hopf fibration
];

// Temporal smoothing for the chain: the scrubbed value is the TARGET; the
// rendered value chases it with this time constant (seconds). A fast flick
// through the page still plays every morph as a watchable flight — particles
// stream through each intermediate form instead of teleporting to the last.
export const CHAIN_SMOOTH_SECONDS = 0.6;

export function chainProgress(progress: number): number {
  let chain = 0;
  for (const [start, end] of CHAIN_WINDOWS) {
    chain += smooth01((progress - start) / (end - start));
  }
  return chain;
}

// Finale: as the Contact section arrives the particles return from the
// content fade and resolve into the invitation. Scrubbed by CONTACT progress
// (how far the contact section has entered the viewport), NOT document scroll
// or the controller: document fractions shift whenever content above grows,
// which leaked the finale into About/Work. Contact progress only moves once
// the preceding content has actually ended, so the outro is condition-driven.
// The fade trails the morph so the particles are already mostly name-shaped
// when they become visible; both clamp to 1 and hold to the page bottom.
// Late windows: contactProgress ≈ 0.5 still means the Work grid owns the top
// half of the screen, so the finale waits — the title only fades in once the
// content above has blurred away, never behind readable cards.
export const NAME_MORPH_START = 0.4;
export const NAME_MORPH_END = 0.78;
export const NAME_FADE_START = 0.55;
export const NAME_FADE_END = 0.88;

export function nameMorphProgress(progress: number): number {
  return smooth01((progress - NAME_MORPH_START) / (NAME_MORPH_END - NAME_MORPH_START));
}

export function nameFadeOpacity(progress: number): number {
  return smooth01((progress - NAME_FADE_START) / (NAME_FADE_END - NAME_FADE_START));
}

// The contact link buttons reveal a beat AFTER the title + email have settled,
// so the closing sequence reads as title → invitation → "here's how". Also in
// CONTACT progress space — the buttons cannot exist before the section does.
// The full-viewport canvas cover (the flat content background that hides the
// scene through Work) lifts just ahead of the title fade, so the stage is
// already open when the type arrives. See SceneCover in __root.
export const CONTACT_CANVAS_REVEAL_START = 0.42;
export const CONTACT_CANVAS_REVEAL_END = 0.7;

export function contactCanvasReveal(progress: number): number {
  return smooth01(
    (progress - CONTACT_CANVAS_REVEAL_START) /
      (CONTACT_CANVAS_REVEAL_END - CONTACT_CANVAS_REVEAL_START),
  );
}

export const CONTACT_LINKS_REVEAL_START = 0.74;
export const CONTACT_LINKS_REVEAL_END = 0.97;

export function contactLinksReveal(progress: number): number {
  return smooth01(
    (progress - CONTACT_LINKS_REVEAL_START) /
      (CONTACT_LINKS_REVEAL_END - CONTACT_LINKS_REVEAL_START),
  );
}

// Scroll-driven book roll: how far into the journey the whole table rolls
// over and away (the camera move the hero had before the static-camera
// experiment — restored by request).
// Feature flag: set to false to keep the camera static on scroll (the rig
// holds its settled pose; morph, colors, and entrance are unaffected).
export const SCROLL_BOOK_ROLL_ENABLED = false;
export const BOOK_ROLL_END = 0.45;

export function bookRoll(progress: number): number {
  if (!SCROLL_BOOK_ROLL_ENABLED) return 0;
  return smooth01(progress / BOOK_ROLL_END);
}

// Atmosphere fireflies drifting above the drafting floor. Count is deliberately
// tiny — one points draw call; they read as embers, not weather.
export const FIREFLY_COUNT = 110;

// Headline corruption bursts: every so often a subset of wordmark particles
// scatters into digital noise and reassembles. Time-driven like the morph —
// the scroll listener never touches it. Skipped under reduced motion.
export const GLITCH_MIN_GAP_SECONDS = 7;
export const GLITCH_GAP_JITTER_SECONDS = 7;
export const GLITCH_BURST_SECONDS = 0.9;


// Smooth Hermite step — maps [0,1] to [0,1] with ease-in/out.
export function smooth01(x: number): number {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

// Width of the "welcome." wordmark in world space (half-width for centering).
// Keeps the text filling ~72% of the viewport, capped at a comfortable max.
export function textHalfWidth(worldWidth: number): number {
  return Math.min(worldWidth * 0.72, 7.2) / 2;
}
