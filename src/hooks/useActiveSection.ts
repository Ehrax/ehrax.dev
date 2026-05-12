import { useEffect } from "react";
import { type SceneSection, useSceneStore } from "~/state/sceneStore";

const SECTION_IDS: SceneSection[] = ["hero", "about", "work", "contact"];

export function useActiveSection(): void {
  const setActiveSection = useSceneStore((s) => s.setActiveSection);

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
}
