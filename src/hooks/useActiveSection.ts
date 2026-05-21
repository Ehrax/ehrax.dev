import { useEffect } from "react";
import { type SceneSection, useSceneStore } from "~/state/sceneStore";
import {
  getDocumentScrollProgress,
  getHeroTextExitProgress,
  getSectionDepthProgress,
  getSectionExitProgress,
  getSectionRevealProgress,
} from "~/ui/Section/sectionRevealProgress";

const SECTION_IDS: SceneSection[] = ["hero", "about", "work", "contact"];

export function useActiveSection(): void {
  const setActiveSection = useSceneStore((s) => s.setActiveSection);
  const setScrollProgress = useSceneStore((s) => s.setScrollProgress);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const id = visible.target.id as SceneSection;
          if (SECTION_IDS.includes(id)) setActiveSection(id);
        }
      },
      { threshold: [0.25, 0.55, 0.8] },
    );

    for (const id of SECTION_IDS) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [setActiveSection]);

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

      for (const section of document.querySelectorAll<HTMLElement>(
        "[data-scroll-reveal-section]",
      )) {
        const rect = section.getBoundingClientRect();
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

        if (section.id === "hero") {
          const heroTextExitProgress = getHeroTextExitProgress({
            sectionTop: rect.top,
            viewportHeight,
          });

          section.style.setProperty("--section-exit-progress", heroTextExitProgress.toFixed(4));
          sceneProgress = Math.max(sceneProgress, heroTextExitProgress * 0.35);
        }

        if (section.id === "about") {
          sceneProgress = Math.max(sceneProgress, progress * 0.74, exitProgress);
        }
      }

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
  }, [setScrollProgress]);
}
