import { useEffect, useState } from "react";
import type { SceneVisual } from "~/state/sceneStore";

type VisualTokens = Record<SceneVisual, string>;

export type ScenePalette = {
  background: VisualTokens;
  dotBase: string;
  dot: VisualTokens;
  floor: string;
  gridPrimary: string;
  gridSecondary: string;
  glyph: VisualTokens;
  glyphEmissive: string;
  pointLight: string;
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
    dotBase: token(styles, "--color-scroll-scene-dot-base"),
    dot: {
      blueprint: token(styles, "--color-scroll-scene-dot-hold"),
      halftone: token(styles, "--color-scroll-scene-dot-start"),
      neon: token(styles, "--color-scroll-scene-dot-final"),
    },
    floor: token(styles, "--color-scroll-scene-floor"),
    gridPrimary: token(styles, "--color-scroll-scene-grid-primary"),
    gridSecondary: token(styles, "--color-scroll-scene-grid-secondary"),
    glyph: {
      blueprint: token(styles, "--color-scroll-scene-glyph-hold"),
      halftone: token(styles, "--color-scroll-scene-glyph-start"),
      neon: token(styles, "--color-scroll-scene-glyph-final"),
    },
    glyphEmissive: token(styles, "--color-scroll-scene-glyph-emissive"),
    pointLight: token(styles, "--color-scroll-scene-point-light"),
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
