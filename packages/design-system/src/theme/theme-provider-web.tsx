"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "../tokens";
import type { ThemeName } from "../tokens/semantic/types";
import { ThemeContext, type ThemePreference } from "./theme-context";

const STORAGE_KEY = "ex:theme";

const readPreference = (): ThemePreference => {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
};

export const ThemeProvider = ({
  children,
  defaultPreference = "system",
}: {
  children: ReactNode;
  defaultPreference?: ThemePreference;
}) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference);
  const [resolved, setResolved] = useState<ThemeName>("dark");

  useEffect(() => {
    setPreferenceState(readPreference());
  }, []);

  useEffect(() => {
    const apply = (next: ThemeName) => {
      setResolved(next);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", next);
      }
    };

    if (preference === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "dark" : "light");
      const onChange = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    apply(preference);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const value = useMemo(
    () => ({
      preference,
      resolved,
      theme: resolved === "dark" ? darkTheme : lightTheme,
      setPreference,
    }),
    [preference, resolved, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
