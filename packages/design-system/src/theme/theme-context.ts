import { createContext, useContext } from "react";
import type { Theme } from "../tokens";
import { lightTheme } from "../tokens";
import type { ThemeName } from "../tokens/semantic/types";

export type ThemePreference = "light" | "dark" | "system";

export type ThemeContextValue = {
  /** What the user picked. `system` follows OS. */
  preference: ThemePreference;
  /** What we actually rendered ('system' resolved to light/dark). */
  resolved: ThemeName;
  /** Resolved theme object. */
  theme: Theme;
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    if (typeof window === "undefined") {
      return {
        preference: "dark",
        resolved: "dark",
        theme: lightTheme,
        setPreference: () => {},
      };
    }
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  }
  return ctx;
};
