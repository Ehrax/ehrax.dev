const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export function smoothScrollStep(start: number, end: number, progress: number): number {
  if (start === end) return progress >= end ? 1 : 0;

  const value = clamp01((progress - start) / (end - start));
  return value * value * (3 - 2 * value);
}

export function getSceneColorMix(progress: number): {
  finalMix: number;
  holdMix: number;
} {
  // Both windows are front-loaded into calm scroll territory (before the
  // About reveal boosts the controller) so the darkening reads as a long
  // gradual dusk over the last forms, not a snap when About arrives. The
  // background is fully dark well before the About copy starts fading in;
  // the last forms then glow against black.
  return {
    holdMix: smoothScrollStep(0.04, 0.28, progress),
    finalMix: smoothScrollStep(0.2, 0.44, progress),
  };
}

// The drafting floor, its lamps, and the fireflies dim out ahead of the
// headline forms: the stage goes dark first, the performer gets the last
// light. This is what keeps the About copy from ever sitting on a glowing
// grid.
export function getFloorEffectOpacity(progress: number): number {
  return 1 - smoothScrollStep(0.26, 0.5, progress);
}

// The headline form is GONE by 0.45 — About's reveal only begins at ~0.455,
// so the form and the copy never share the screen. Additive bloom makes even
// 20% opacity read bright, so "mostly faded" is not enough; the windows must
// not overlap at all.
export function getSceneEffectOpacity(progress: number): number {
  return 1 - smoothScrollStep(0.39, 0.45, progress);
}

export function getAboutSceneProgress({
  depthProgress,
  exitProgress,
  revealProgress,
  scrollProgress,
}: {
  depthProgress: number;
  exitProgress: number;
  revealProgress: number;
  scrollProgress: number;
}): number {
  // About's own reveal drives the fade: by the time the section is readable
  // (reveal ≈ 1) the scene effects are fully gone and the gradient has landed
  // on the content background — the copy never fights the particles.
  return Math.max(scrollProgress, revealProgress * 0.74, depthProgress * 0.86, exitProgress * 0.94);
}
