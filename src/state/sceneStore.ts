import { create } from "zustand";

export type SceneSection = "hero" | "about" | "work" | "contact";

type SceneState = {
  activeSection: SceneSection;
  sceneEnabled: boolean;
  setActiveSection: (section: SceneSection) => void;
  setSceneEnabled: (enabled: boolean) => void;
};

export const useSceneStore = create<SceneState>((set) => ({
  activeSection: "hero",
  sceneEnabled: true,
  setActiveSection: (section) => set({ activeSection: section }),
  setSceneEnabled: (enabled) => set({ sceneEnabled: enabled }),
}));
