import { describe, expect, it } from "vitest";
import {
  getAboutSceneProgress,
  getFloorEffectOpacity,
  getSceneColorMix,
  getSceneEffectOpacity,
} from "./sceneTransition";

describe("scene transition", () => {
  it("keeps the hero-to-about color transition gradual", () => {
    expect(getSceneColorMix(0.06).holdMix).toBeLessThan(0.05);
    expect(getSceneColorMix(0.16).holdMix).toBeGreaterThan(0.4);
    expect(getSceneColorMix(0.16).holdMix).toBeLessThan(0.6);
  });

  it("starts the dusk before the final form and lands before about is readable", () => {
    expect(getSceneColorMix(0.2).finalMix).toBe(0);
    expect(getSceneColorMix(0.3).finalMix).toBeGreaterThan(0.3);
    expect(getSceneColorMix(0.4).finalMix).toBeGreaterThan(0.7);
    expect(getSceneColorMix(0.44).finalMix).toBe(1);
  });

  it("dims the floor ahead of the headline forms", () => {
    expect(getFloorEffectOpacity(0.26)).toBe(1);
    expect(getFloorEffectOpacity(0.45)).toBeLessThan(0.25);
    expect(getFloorEffectOpacity(0.5)).toBe(0);
  });

  it("removes the headline form entirely before about copy starts revealing", () => {
    expect(getSceneEffectOpacity(0.39)).toBe(1);
    expect(getSceneEffectOpacity(0.43)).toBeLessThan(0.6);
    expect(getSceneEffectOpacity(0.45)).toBe(0);
    expect(getSceneEffectOpacity(0.4656)).toBe(0);
  });

  it("completes the effect fade once about is fully revealed", () => {
    const progress = getAboutSceneProgress({
      depthProgress: 0.1,
      exitProgress: 0,
      revealProgress: 1,
      scrollProgress: 0.37,
    });
    expect(getSceneEffectOpacity(progress)).toBe(0);
  });

  it("keeps the scene fully on while about is still far below the fold", () => {
    expect(
      getAboutSceneProgress({
        depthProgress: 0,
        exitProgress: 0,
        revealProgress: 0,
        scrollProgress: 0.12,
      }),
    ).toBe(0.12);
  });

  it("darkens the scene as about exits into the default content", () => {
    expect(
      getAboutSceneProgress({
        depthProgress: 1,
        exitProgress: 0.9,
        revealProgress: 1,
        scrollProgress: 0.62,
      }),
    ).toBeCloseTo(0.86);
  });
});
