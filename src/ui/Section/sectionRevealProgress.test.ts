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

  it("only blurs out once the sticky section is handing off", () => {
    expect(getSectionExitProgress({ sectionBottom: 900, viewportHeight: 1_000 })).toBe(0);
    expect(getSectionExitProgress({ sectionBottom: 320, viewportHeight: 1_000 })).toBe(1);
  });

  it("hides hero copy after the first deliberate scroll", () => {
    expect(getHeroTextExitProgress({ sectionTop: 0, viewportHeight: 1_000 })).toBe(0);
    expect(getHeroTextExitProgress({ sectionTop: -340, viewportHeight: 1_000 })).toBe(1);
  });

  it("adds depth after the section has locked near center", () => {
    expect(getSectionDepthProgress({ sectionTop: 280, viewportHeight: 1_000 })).toBe(0);
    expect(getSectionDepthProgress({ sectionTop: -540, viewportHeight: 1_000 })).toBe(1);
  });
});
