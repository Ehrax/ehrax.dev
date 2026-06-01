import { create } from "zustand";
import type { ThemePreference } from "~/types/site";

const STORAGE_KEY = "theme-preference";

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // ignore storage errors
  }
  return "system";
}

function persistTheme(pref: ThemePreference): void {
  if (typeof window === "undefined") return;
  try {
    if (pref === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, pref);
    }
  } catch {
    // ignore storage errors
  }
}

type AppState = {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  themePreference: readStoredTheme(),
  setThemePreference: (preference) => {
    persistTheme(preference);
    set({ themePreference: preference });
  },
  toggleTheme: () => {
    const current = get().themePreference;
    const next: ThemePreference =
      current === "dark" ? "light" : current === "light" ? "system" : "dark";
    persistTheme(next);
    set({ themePreference: next });
  },
}));
