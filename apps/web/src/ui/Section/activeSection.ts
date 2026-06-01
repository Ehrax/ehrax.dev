import type { SceneSection } from "~/state/sceneStore";

type SectionRect = {
  id: SceneSection;
  top: number;
  bottom: number;
};

const ACTIVE_SECTION_ANCHOR = 0.42;
const NAV_REVEAL_ANCHOR = -0.12;

export function getActiveSectionFromRects({
  sections,
  viewportHeight,
}: {
  sections: SectionRect[];
  viewportHeight: number;
}): SceneSection {
  if (sections.length === 0 || viewportHeight <= 0) return "hero";

  const anchorY = viewportHeight * ACTIVE_SECTION_ANCHOR;
  const reachedSections = sections.filter((section) => section.top <= anchorY);
  const activeSection = reachedSections.at(-1);

  return activeSection?.id ?? sections[0]?.id ?? "hero";
}

export function hasSectionReachedNavReveal({
  sectionTop,
  viewportHeight,
}: {
  sectionTop: number;
  viewportHeight: number;
}): boolean {
  if (viewportHeight <= 0) return false;
  return sectionTop <= viewportHeight * NAV_REVEAL_ANCHOR;
}
