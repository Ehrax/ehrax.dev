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
  return {
    holdMix: smoothScrollStep(0.08, 0.58, progress),
    finalMix: smoothScrollStep(0.38, 0.82, progress),
  };
}

export function getSceneEffectOpacity(progress: number): number {
  return 1 - smoothScrollStep(0.42, 0.74, progress);
}

export function getSceneGridOpacity(progress: number): number {
  return getSceneEffectOpacity(progress);
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
  return Math.max(scrollProgress, revealProgress * 0.28, depthProgress * 0.58, exitProgress * 0.78);
}
