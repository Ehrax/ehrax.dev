type SectionRevealProgressInput = {
  sectionBottom?: number;
  sectionTop: number;
  sectionHeight: number;
  viewportHeight: number;
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export function getSectionRevealProgress({
  sectionTop,
  sectionHeight,
  viewportHeight,
}: SectionRevealProgressInput): number {
  if (sectionHeight <= 0 || viewportHeight <= 0) return 0;

  // Reveal starts only once the section is well inside the viewport, so the
  // scene's finale gets its moment before the copy fades in over it.
  const revealStart = viewportHeight * 0.72;
  const revealEnd = viewportHeight * 0.24;

  return clamp01((revealStart - sectionTop) / (revealStart - revealEnd));
}

export function getSectionExitProgress({
  sectionBottom,
  viewportHeight,
  // Where the farewell runs, as fractions of the viewport the section bottom
  // crosses. The defaults suit sticky sections (About), whose copy has been
  // read in place before the empty runway scrolls out. Flowing sections
  // (Work) pass a lower window so content only blurs once it is actually
  // leaving the upper half of the screen, not while it is still being read.
  exitStartRatio = 1.12,
  exitEndRatio = 0.42,
}: Pick<SectionRevealProgressInput, "sectionBottom" | "viewportHeight"> & {
  exitStartRatio?: number;
  exitEndRatio?: number;
}): number {
  if (sectionBottom === undefined || viewportHeight <= 0) return 0;

  const exitStart = viewportHeight * exitStartRatio;
  const exitEnd = viewportHeight * exitEndRatio;

  return clamp01((exitStart - sectionBottom) / (exitStart - exitEnd));
}

export function getHeroTextExitProgress({
  sectionTop,
  viewportHeight,
}: Pick<SectionRevealProgressInput, "sectionTop" | "viewportHeight">): number {
  if (viewportHeight <= 0) return 0;

  const exitStart = 0;
  const exitDistance = viewportHeight * 0.74;

  return clamp01((-sectionTop - exitStart) / exitDistance);
}

export function getSectionDepthProgress({
  sectionTop,
  viewportHeight,
}: Pick<SectionRevealProgressInput, "sectionTop" | "viewportHeight">): number {
  if (viewportHeight <= 0) return 0;

  const depthStart = viewportHeight * 0.18;
  const depthDistance = viewportHeight * 1.25;

  return clamp01((depthStart - sectionTop) / depthDistance);
}

export function getDocumentScrollProgress({
  scrollY,
  scrollHeight,
  viewportHeight,
}: {
  scrollY: number;
  scrollHeight: number;
  viewportHeight: number;
}): number {
  const scrollable = scrollHeight - viewportHeight;
  if (scrollable <= 0) return 0;
  return clamp01(scrollY / scrollable);
}
