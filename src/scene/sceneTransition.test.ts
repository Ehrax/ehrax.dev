import { describe, expect, it } from "vitest";
import {
  getAboutSceneProgress,
  getSceneColorMix,
  getSceneEffectOpacity,
  getSceneGridOpacity,
} from "./sceneTransition";

describe("scene transition", () => {
  it("keeps the hero-to-about color transition gradual", () => {
    expect(getSceneColorMix(0.12).holdMix).toBeLessThan(0.05);
    expect(getSceneColorMix(0.34).holdMix).toBeGreaterThan(0.4);
    expect(getSceneColorMix(0.34).holdMix).toBeLessThan(0.6);
  });

  it("starts darkening during about instead of waiting for work", () => {
    expect(getSceneColorMix(0.38).finalMix).toBe(0);
    expect(getSceneColorMix(0.68).finalMix).toBeGreaterThan(0.6);
    expect(getSceneColorMix(0.82).finalMix).toBe(1);
  });

  it("fades blueprint grid lines before the default content takes over", () => {
    expect(getSceneGridOpacity(0.42)).toBe(1);
    expect(getSceneGridOpacity(0.62)).toBeLessThan(0.5);
    expect(getSceneGridOpacity(0.74)).toBe(0);
  });

  it("fades scene effects into a solid content background", () => {
    expect(getSceneEffectOpacity(0.42)).toBe(1);
    expect(getSceneEffectOpacity(0.62)).toBeLessThan(0.5);
    expect(getSceneEffectOpacity(0.74)).toBe(0);
  });

  it("does not let about reveal jump the scene into the final color", () => {
    expect(
      getAboutSceneProgress({
        depthProgress: 0.1,
        exitProgress: 0,
        revealProgress: 1,
        scrollProgress: 0.37,
      }),
    ).toBe(0.37);
  });

  it("darkens the scene as about exits into the default content", () => {
    expect(
      getAboutSceneProgress({
        depthProgress: 1,
        exitProgress: 0.9,
        revealProgress: 1,
        scrollProgress: 0.62,
      }),
    ).toBeCloseTo(0.702);
  });
});
