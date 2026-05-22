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
      }

      setActiveSection(getActiveSectionFromRects({ sections: sectionRects, viewportHeight }));
      setScrollProgress(scrollProgress, sceneProgress);
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
