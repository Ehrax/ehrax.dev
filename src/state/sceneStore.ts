import { create } from "zustand";

export type SceneSection = "hero" | "about" | "work" | "contact";
export type SceneVisual = "halftone" | "blueprint" | "neon";

type SceneState = {
  activeSection: SceneSection;
  controllerValue: number;
  sceneEnabled: boolean;
  scrollProgress: number;
  visual: SceneVisual;
  setActiveSection: (section: SceneSection) => void;
  setScrollProgress: (scrollProgress: number, controllerValue?: number) => void;
  setSceneEnabled: (enabled: boolean) => void;
};

function getSceneVisual(progress: number): SceneVisual {
  if (progress <= 0.2) return "halftone";
  if (progress < 0.8) return "blueprint";
  return "neon";
}

export const useSceneStore = create<SceneState>((set) => ({
  activeSection: "hero",
  controllerValue: 0,
  sceneEnabled: true,
  scrollProgress: 0,
  visual: "halftone",
  setActiveSection: (section) => set({ activeSection: section }),
  setScrollProgress: (scrollProgress, controllerValue = scrollProgress) =>
    set({
      controllerValue,
      scrollProgress,
      visual: getSceneVisual(controllerValue),
    }),
  setSceneEnabled: (enabled) => set({ sceneEnabled: enabled }),
}));
