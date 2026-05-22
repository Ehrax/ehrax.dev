import { describe, expect, it } from "vitest";
import {
  getHeroTextExitProgress,
  getSectionDepthProgress,
  getSectionExitProgress,
  getSectionRevealProgress,
} from "./sectionRevealProgress";

describe("section reveal progress", () => {
  it("starts before a section reaches the reveal window", () => {
    expect(
      getSectionRevealProgress({
        sectionTop: 901,
        sectionHeight: 1_000,
        viewportHeight: 1_000,
      }),
    ).toBe(0);
  });

  it("finishes after most of the sticky section has passed", () => {
    expect(
      getSectionRevealProgress({
        sectionTop: -800,
        sectionHeight: 1_000,
        viewportHeight: 1_000,
      }),
    ).toBe(1);
  });

  it("keeps content readable once it has entered the viewport hold", () => {
    expect(
      getSectionRevealProgress({
        sectionTop: 50,
        sectionHeight: 1_000,
        viewportHeight: 1_000,
      }),
    ).toBe(1);
  });

  it("maps the section through the reveal window before the sticky hold", () => {
    expect(
      getSectionRevealProgress({
        sectionTop: 570,
        sectionHeight: 1_000,
        viewportHeight: 1_000,
      }),
    ).toBe(0.5);
  });

  it("starts the blur before the sticky section has fully handed off", () => {
    expect(getSectionExitProgress({ sectionBottom: 1_140, viewportHeight: 1_000 })).toBe(0);
    expect(getSectionExitProgress({ sectionBottom: 960, viewportHeight: 1_000 })).toBeGreaterThan(
      0.2,
    );
    expect(getSectionExitProgress({ sectionBottom: 420, viewportHeight: 1_000 })).toBe(1);
  });

  it("keeps hero copy around through a longer deliberate scroll", () => {
    expect(getHeroTextExitProgress({ sectionTop: 0, viewportHeight: 1_000 })).toBe(0);
    expect(getHeroTextExitProgress({ sectionTop: -340, viewportHeight: 1_000 })).toBeLessThan(0.5);
    expect(getHeroTextExitProgress({ sectionTop: -560, viewportHeight: 1_000 })).toBeLessThan(0.6);
    expect(getHeroTextExitProgress({ sectionTop: -1_000, viewportHeight: 1_000 })).toBe(1);
  });

  it("adds depth slowly after the section has locked near center", () => {
    expect(getSectionDepthProgress({ sectionTop: 280, viewportHeight: 1_000 })).toBe(0);
    expect(getSectionDepthProgress({ sectionTop: -120, viewportHeight: 1_000 })).toBeLessThan(0.3);
    expect(getSectionDepthProgress({ sectionTop: -1_070, viewportHeight: 1_000 })).toBe(1);
  });
});
