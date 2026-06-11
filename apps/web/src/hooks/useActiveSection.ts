import { useEffect } from "react";
import { getAboutSceneProgress } from "~/scene/sceneTransition";
import { type SceneSection, useSceneStore } from "~/state/sceneStore";
import { getActiveSectionFromRects, hasSectionReachedNavReveal } from "~/ui/Section/activeSection";
import {
  getDocumentScrollProgress,
  getHeroTextExitProgress,
  getSectionDepthProgress,
  getSectionExitProgress,
  getSectionRevealProgress,
} from "~/ui/Section/sectionRevealProgress";

const SECTION_IDS: SceneSection[] = ["hero", "about", "work", "contact"];

export function useActiveSection(): void {
  const revealNav = useSceneStore((s) => s.revealNav);
  const setActiveSection = useSceneStore((s) => s.setActiveSection);
  const setScrollProgress = useSceneStore((s) => s.setScrollProgress);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const updateRevealProgress = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const scrollProgress = getDocumentScrollProgress({
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight,
      });

      let sceneProgress = scrollProgress;
      let contactProgress = 0;
      const sectionRects: Array<{ id: SceneSection; top: number; bottom: number }> = [];

      for (const section of document.querySelectorAll<HTMLElement>(
        "[data-scroll-reveal-section]",
      )) {
        const rect = section.getBoundingClientRect();
        const id = section.id as SceneSection;
        if (SECTION_IDS.includes(id)) {
          sectionRects.push({ id, top: rect.top, bottom: rect.bottom });
        }
        const progress = getSectionRevealProgress({
          sectionTop: rect.top,
          sectionHeight: rect.height,
          viewportHeight,
        });
        const exitProgress = getSectionExitProgress({
          sectionBottom: rect.bottom,
          viewportHeight,
          // Work flows (no sticky lock) and exits in two phases (recede, then
          // blur — see Section.module.css), so it gets a longer window: the
          // shrink starts as the end of the grid clears the fold, the blur
          // half only lands once the content is genuinely leaving.
          ...(id === "work" ? { exitStartRatio: 0.95, exitEndRatio: 0.15 } : {}),
        });
        const depthProgress = getSectionDepthProgress({
          sectionTop: rect.top,
          viewportHeight,
        });

        section.style.setProperty("--section-reveal-progress", progress.toFixed(4));
        section.style.setProperty("--section-exit-progress", exitProgress.toFixed(4));
        section.style.setProperty("--section-depth-progress", depthProgress.toFixed(4));

        if (id === "hero") {
          const heroTextExitProgress = getHeroTextExitProgress({
            sectionTop: rect.top,
            viewportHeight,
          });

          section.style.setProperty("--section-exit-progress", heroTextExitProgress.toFixed(4));
          sceneProgress = Math.max(sceneProgress, heroTextExitProgress * 0.35);
        }

        if (id === "about") {
          if (hasSectionReachedNavReveal({ sectionTop: rect.top, viewportHeight })) {
            revealNav();
          }

          sceneProgress = Math.max(
            sceneProgress,
            getAboutSceneProgress({
              depthProgress,
              exitProgress,
              revealProgress: progress,
              scrollProgress,
            }),
          );
        }
        if (id === "contact") {
          // 0 while the section is below the fold, 1 once its own height has
          // scrolled in. Anchored to the section, not document fractions, so
          // the finale fires when the preceding content ends — no matter how
          // much Work content is added later.
          contactProgress =
            rect.height > 0
              ? Math.min(1, Math.max(0, (viewportHeight - rect.top) / rect.height))
              : 0;
        }
      }

      setActiveSection(getActiveSectionFromRects({ sections: sectionRects, viewportHeight }));
      setScrollProgress(scrollProgress, sceneProgress, contactProgress);
    };

    const scheduleRevealProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateRevealProgress);
    };

    updateRevealProgress();
    window.addEventListener("scroll", scheduleRevealProgress, { passive: true });
    window.addEventListener("resize", scheduleRevealProgress);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleRevealProgress);
      window.removeEventListener("resize", scheduleRevealProgress);
    };
  }, [revealNav, setActiveSection, setScrollProgress]);
}
