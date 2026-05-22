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

  const revealStart = viewportHeight * 0.86;
  const revealEnd = viewportHeight * 0.28;

  return clamp01((revealStart - sectionTop) / (revealStart - revealEnd));
}

export function getSectionExitProgress({
  sectionBottom,
  viewportHeight,
}: Pick<SectionRevealProgressInput, "sectionBottom" | "viewportHeight">): number {
  if (sectionBottom === undefined || viewportHeight <= 0) return 0;

  const exitStart = viewportHeight * 1.12;
  const exitEnd = viewportHeight * 0.42;

  return clamp01((exitStart - sectionBottom) / (exitStart - exitEnd));
}

export function getHeroTextExitProgress({
  sectionTop,
  viewportHeight,
}: Pick<SectionRevealProgressInput, "sectionTop" | "viewportHeight">): number {
  if (viewportHeight <= 0) return 0;

  return clamp01(-sectionTop / viewportHeight);
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
