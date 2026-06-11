import { create } from "zustand";

export type SceneSection = "hero" | "about" | "work" | "contact";
export type SceneVisual = "halftone" | "blueprint" | "neon";

type SceneState = {
  activeSection: SceneSection;
  // How far the Contact section has entered the viewport (0 = still below the
  // fold, 1 = fully arrived). Drives the closing finale, so the outro starts
  // whenever the preceding content ends — however long that content grows.
  contactProgress: number;
  controllerValue: number;
  navRevealed: boolean;
  sceneEnabled: boolean;
  scrollProgress: number;
  visual: SceneVisual;
  revealNav: () => void;
  setActiveSection: (section: SceneSection) => void;
  setScrollProgress: (
    scrollProgress: number,
    controllerValue?: number,
    contactProgress?: number,
  ) => void;
  setSceneEnabled: (enabled: boolean) => void;
};

function getSceneVisual(progress: number): SceneVisual {
  if (progress <= 0.2) return "halftone";
  if (progress < 0.8) return "blueprint";
  return "neon";
}

export const useSceneStore = create<SceneState>((set) => ({
  activeSection: "hero",
  contactProgress: 0,
  controllerValue: 0,
  navRevealed: false,
  sceneEnabled: true,
  scrollProgress: 0,
  visual: "halftone",
  revealNav: () => set({ navRevealed: true }),
  setActiveSection: (section) => set({ activeSection: section }),
  setScrollProgress: (scrollProgress, controllerValue = scrollProgress, contactProgress = 0) =>
    set({
      contactProgress,
      controllerValue,
      scrollProgress,
      visual: getSceneVisual(controllerValue),
    }),
  setSceneEnabled: (enabled) => set({ sceneEnabled: enabled }),
}));
