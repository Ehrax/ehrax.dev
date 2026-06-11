import { useEffect, useState } from "react";
import type { SceneVisual } from "~/state/sceneStore";

type NebulaColors = { core: string; mid: string; rim: string; accent: string };

type VisualTokens = Record<SceneVisual, string>;

export type ScenePalette = {
  background: VisualTokens;
  nebula: NebulaColors;
  star: string;
};

const readToken = (styles: CSSStyleDeclaration, name: string, seen = new Set<string>()): string => {
  if (seen.has(name)) return "";
  seen.add(name);

  const value = styles.getPropertyValue(name).trim();
  return value.replace(/var\((--[a-z0-9-]+)\)/gi, (_, nestedName: string) =>
    readToken(styles, nestedName, seen),
  );
};

const token = (styles: CSSStyleDeclaration, name: string): string => readToken(styles, name);

function readScenePalette(): ScenePalette {
  const styles = getComputedStyle(document.documentElement);

  return {
    background: {
      blueprint: token(styles, "--color-scroll-scene-bg-hold"),
      halftone: token(styles, "--color-scroll-scene-bg-start"),
      neon: token(styles, "--color-scroll-scene-bg-final"),
    },
    nebula: {
      core: token(styles, "--color-scroll-scene-nebula-core"),
      mid: token(styles, "--color-scroll-scene-nebula-mid"),
      rim: token(styles, "--color-scroll-scene-nebula-rim"),
      accent: token(styles, "--color-scroll-scene-nebula-accent"),
    },
    star: token(styles, "--color-scroll-scene-star"),
  };
}

export function useScenePalette(): ScenePalette {
  const [palette, setPalette] = useState(readScenePalette);

  useEffect(() => {
    const update = () => setPalette(readScenePalette());
    const observer = new MutationObserver(update);

    observer.observe(document.documentElement, {
      attributeFilter: ["data-theme", "style", "class"],
      attributes: true,
    });
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    colorSchemeQuery.addEventListener("change", update);

    return () => {
      observer.disconnect();
      colorSchemeQuery.removeEventListener("change", update);
    };
  }, []);

  return palette;
}
